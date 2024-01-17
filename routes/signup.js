const express = require("express");
const router = express.Router();
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// GET login page
router.get("/", (req, res, next) => {
    res.render("signup", {
        message: "",
    });
});

// POST for sign-up form
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const action = req.body.action;

        if (action === "signup") {
            const {
                username,
                password,
                email,
                phone,
                first_name,
                last_name,
                profilePicture,
            } = req.body;

            // Make username all lowercase and take out any spaces. Including leading and trailing
            const processedUsername = username.toLowerCase().trim();
            const processedEmail = email.trim();
            const processedPhone = phone.trim();
            const processedFirstName = first_name.trim();
            const processedLastName = last_name.trim();

            const existingUser = await User.findOne({
                username: processedUsername,
            });
            if (existingUser) {
                return res.render("signup", {
                    message: "Username already exists. Please choose another",
                });
            }
            // Hash and Salt password before save
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            //Create a new user with User model
            const newUser = new User({
                username: processedUsername,
                password: hashedPassword, // Save the hash password
                email: processedEmail,
                phone: processedPhone,
                first_name: processedFirstName,
                last_name: processedLastName,
                profile_picture: profilePicture,
                loginHistory: {
                    timestamp: new Date(),
                    ipAddress: req.ip,
                },
            });

            // Save newUser to DB
            await newUser.save();

            // Log the user in automatically by creating a session
            req.login(newUser, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/features");
            });
        }
    })
);

module.exports = router;
