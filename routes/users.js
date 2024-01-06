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

        res.render("users", {
            title: "Users Page",
            users: users,
            currentUser: req.user,
            currentPage: "/users",
        });
    })
);

// POST for follow request
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const currentUser = req.user;
        const userToFollow = req.body.userToFollow;

        // Check if already followed in array
        if (!currentUser.followed.includes(userToFollow)) {
            // Add user to followed array
            currentUser.followed.push(userToFollow);
            await currentUser.save();
        } else if (currentUser.followed.includes(userToFollow)) {
            const followedUserIndex =
                currentUser.followed.indexOf(userToFollow);
            currentUser.followed.splice(followedUserIndex, 1);
            await currentUser.save();
        }
        res.redirect("/users");
    })
);

module.exports = router;
