const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
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
            .populate("comments.author")
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array

        res.render("userPage", {
            title: "User Page",
            user: user,
            currentUser: req.user,
            posts: posts,
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

// POST for comments form
router.post(
    "/comments",
    asyncHandler(async (req, res, next) => {
        const content = req.body.content;
        const postId = req.body.postId;
        const userToFollow = req.body.userToFollow;

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
        res.redirect(`/userPage/${userToFollow}`);
    })
);

// POST for post likes
router.post(
    "/likes",
    asyncHandler(async (req, res, next) => {
        const postId = req.body.postId; // retrieve related postId from form (saves as a string)
        const currentUser = req.user._id; // define current users id
        const userToFollow = req.body.userToFollow;
        const post = await Post.findById(postId); // find the actual post that matches the postId provided by form

        // Check if current user already liked post
        if (!post.likes.includes(currentUser)) {
            // Add user to likes array
            post.likes.push(currentUser);
            await post.save();
        } else if (post.likes.includes(currentUser)) {
            // If user has not already liked post.
            const userIndex = post.likes.indexOf(currentUser); // Returns the index of current user in likes array
            post.likes.splice(userIndex, 1); // Removes current user from likes array
            await post.save();
        }
        res.redirect(`/userPage/${userToFollow}`);
    })
);

module.exports = router;
