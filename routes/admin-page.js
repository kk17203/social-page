const express = require("express");
const router = express.Router();
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const User = require("../models/users");

/* GET home page. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // See if user is still logged in
        if (!req.user || req.user.adminPassword !== process.env.SECRET_VALUE) {
            console.log(process.env.SECRET_VALUE);
            console.log(req.user.adminPassword);
            return res.redirect("/dashboard");
        }

        const users = await User.find({}).exec();

        res.render("adminPage", { title: "Admin", users: users });
    })
);

module.exports = router;
