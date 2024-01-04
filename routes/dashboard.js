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

        res.render("dashboard", {
            title: "Dashboard",
            user: req.user,
            posts: posts,
            comments: comments,
        });
    })
);

// POST for posts
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const post = req.body.post;

        const newPost = new Post({
            author: req.user._id,
            post,
        });

        // Save the new Post to DB
        await newPost.save();
        res.redirect("/dashboard");
    })
);

// POST for comments form
router.post(
    "/comments",
    asyncHandler(async (req, res, next) => {
        const content = req.body.content;
        const postId = req.body.postId;

        const newComment = new Comment({
            author: req.user._id,
            post: postId,
            content: content,
        });

        // Save the new Comment to DB
        await newComment.save();
        res.redirect("/dashboard");
    })
);

module.exports = router;
