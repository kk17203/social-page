const express = require("express");
const router = express.Router();
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// GET login page
router.get("/", (req, res, next) => {
    res.render("signup");
});

// POST for sign-up form
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const action = req.body.action;

        if (action === "signup") {
            const { username, password, email, phone, first_name, last_name } =
                req.body;

            // Hash and Salt password before save
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            //Create a new user with User model
            const newUser = new User({
                username,
                password: hashedPassword, // Save the hash password
                email,
                phone,
                first_name,
                last_name,
            });

            // Save newUser to DB
            await newUser.save();
            res.redirect("/");

            // Where the auto login function will go
        }
    })
);

module.exports = router;
