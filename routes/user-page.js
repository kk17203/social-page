const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/users");
const multer = require("multer");
const multerUpload = multer();

/* GET home page. */
router.get(
    "/:userId",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const user = await User.findById(req.params.userId);

        // Find users that their id is inside user.followers array
        const followers = await User.find({
            _id: { $in: user.followers },
        });

        // Find users that their id is inside user.followed array
        const following = await User.find({
            _id: { $in: user.followed },
        });

        const posts = await Post.find({})
            .populate("comments.author")
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array
        console.log(user._id.toString());
        console.log(req.user._id.toString());
        res.render("userPage", {
            title: "User Page",
            user: user,
            currentUser: req.user,
            posts: posts,
            currentPage: "",
            followers: followers,
            following: following,
        });
    })
);

// POST for follow request
router.post(
    "/followUser",
    multerUpload.none(),
    asyncHandler(async (req, res, next) => {
        const currentUser = req.user; // returns whole user
        const currentUserId = req.user._id;
        const userToFollowId = req.body.userToFollow; // returns id
        const userToFollow = await User.findById(userToFollowId); // Find User with id of userToFollowId

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
        res.status(204).end();
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
            author_name: req.user.name,
            author_username: req.user.username,
            content: content,
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);

        // Save the new Comment to DB
        await post.save();
        res.redirect(`/userPage/${userToFollow}`);
    })
);

module.exports = router;
