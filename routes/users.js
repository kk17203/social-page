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
            user: req.user,
            currentPage: "/users",
        });
    })
);

// POST for follow request
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const currentUser = req.user; // returns whole user
        const currentUserId = req.user._id;
        const userToFollowId = req.body.userToFollow; // returns id
        const userToFollow = await User.findById(userToFollowId); // Find User with id of userToFollowId

        console.log(currentUser);
        console.log(`currentUserId ${currentUserId}`);
        console.log(`userToFollowId ${userToFollowId}`);
        console.log(`User to Follow ${userToFollow}`);

        // Check if already followed in array
        if (!currentUser.followed.includes(userToFollowId)) {
            // Add user that we want to follow into current users followed array
            currentUser.followed.push(userToFollowId);
            // Add current user into other users followers array
            userToFollow.followers.push(currentUserId);
            await Promise.all([currentUser.save(), userToFollow.save()]);
        } else if (currentUser.followed.includes(userToFollowId)) {
            // Find index of followed user in current users followers array
            const followedUserIndex =
                currentUser.followed.indexOf(userToFollowId);
            // Delete followed user from current users array
            currentUser.followed.splice(followedUserIndex, 1);
            // Find index of current user in followed users followers array
            const currentUserIndex =
                userToFollow.followers.indexOf(currentUserId);
            // Delete current user from followed users followers array
            userToFollow.followers.splice(currentUserIndex, 1);
            await Promise.all([currentUser.save(), userToFollow.save()]);
        }
        res.redirect("/users");
    })
);

module.exports = router;
