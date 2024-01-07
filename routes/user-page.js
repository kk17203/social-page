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

module.exports = router;
