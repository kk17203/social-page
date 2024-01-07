const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const User = require("../models/users");

/* GET home page. */
router.get(
    "/:userId",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const user = await User.findById(req.params.userId);

        const posts = await Post.find({})
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array

        const comments = await Comment.find({})
            .sort({ createdAt: -1 })
            .populate("post")
            .populate("author"); // Populate the 'post' and 'author' fields in the 'comments' array

        res.render("userPage", {
            title: "User Page",
            user: user,
            posts: posts,
            comments: comments,
            currentPage: "",
        });
    })
);

// POST for follow request
router.post(
    "/followUser",
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
        res.redirect(`/userPage/${userToFollow}`);
    })
);

module.exports = router;
