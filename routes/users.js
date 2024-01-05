const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/users");

/* GET home page. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const users = await User.find({}).exec();

        res.render("users", { title: "Users Page", users: users });
    })
);

module.exports = router;
