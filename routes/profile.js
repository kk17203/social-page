const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/users");

/* GET home page. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const posts = await Post.find({})
            .populate("comments.author")
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array

        res.render("profile", {
            title: "Profile Page",
            user: req.user,
            posts: posts,
            currentPage: "/profile",
        });
    })
);

// POST for Profile Picture selection
router.post(
    "/selectPic",
    asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const selectedPic = req.body.profilePicture;

        console.log(req.body);
        console.log(userId);
        console.log(selectedPic);

        await User.findByIdAndUpdate(userId, {
            profile_picture: selectedPic,
        });
        res.redirect("/profile");
    })
);

// POST for comments form
router.post(
    "/comments",
    asyncHandler(async (req, res, next) => {
        const content = req.body.content;
        const postId = req.body.postId;

        const post = await Post.findById(postId);

        if (!post) {
            // Handle the case where the post is not found
            return res.status(404).json({ error: "Post not found" });
        }

        // Create a new comment
        const newComment = {
            author: req.user._id,
            content: content,
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);

        // Save the new Comment to DB
        await post.save();
        console.log(`THIS ${req.originalUrl}`);
        res.redirect("/profile");
    })
);

module.exports = router;
