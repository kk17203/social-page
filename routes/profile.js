const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const Comment = require("../models/comments");

/* GET home page. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const posts = await Post.find({})
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array

        const comments = await Comment.find({})
            .sort({ createdAt: -1 })
            .populate("post")
            .populate("author"); // Populate the 'post' and 'author' fields in the 'comments' array

        res.render("profile", {
            title: "Profile Page",
            user: req.user,
            posts: posts,
            comments: comments,
            currentPage: "/profile",
        });
    })
);

module.exports = router;
