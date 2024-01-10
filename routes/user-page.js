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
// router.post(
//     "/followUser",
//     asyncHandler(async (req, res, next) => {
//         const currentUser = req.user;
//         const userToFollow = req.body.userToFollow;

//         // Check if already followed in array
//         if (!currentUser.followed.includes(userToFollow)) {
//             // Add user to followed array
//             currentUser.followed.push(userToFollow);
//             await currentUser.save();
//         } else if (currentUser.followed.includes(userToFollow)) {
//             const followedUserIndex =
//                 currentUser.followed.indexOf(userToFollow);
//             currentUser.followed.splice(followedUserIndex, 1);
//             await currentUser.save();
//         }
//         res.redirect(`/userPage/${userToFollow}`);
//     })
// );

// POST for follow request
router.post(
    "/followUser",
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
        res.redirect(`/userPage/${userToFollowId}`);
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
