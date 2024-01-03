const express = require("express");
const router = express.Router();
const User = require("../models/users");
const asyncHandler = require("express-async-handler");

// GET login page
router.get("/", (req, res, next) => {
    res.render("login");
});

// POST for sign-up form
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const { username, password, email, first_name, last_name } = req.body;

        //Create a new user with User model
        const newUser = new User({
            username,
            password,
            email,
            first_name,
            last_name,
        });

        // Save newUser to DB
        await newUser.save();
        res.redirect("/");

        // Where the auto login function will go
    })
);

module.exports = router;
