const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/users");
const path = require("path");
const multer = require("multer");

/* GET home page. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);
        // Find users that their id is inside currentUser.followers array
        const followers = await User.find({
            _id: { $in: currentUser.followers },
        });

        // Find users that their id is inside currentUser.followed array
        const following = await User.find({
            _id: { $in: currentUser.followed },
        });

        const posts = await Post.find({})
            .populate("comments.author")
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array

        res.render("profile", {
            title: "Profile Page",
            user: req.user,
            posts: posts,
            currentPage: "/profile",
            followers: followers,
            following: following,
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

// Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "../public/images/uploads");
        cb(null, uploadDir); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        // Rename the file to avoid conflicts
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

// Set up Multer config with security measures
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5 MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            console.log("Please upload a valid image file");
            return cb(new Error("Please upload a valid image file"));
        }
        cb(undefined, true);
    },
});

// POST for posts
router.post(
    "/posts",
    upload.single("image"),
    asyncHandler(async (req, res, next) => {
        const newPost = new Post({
            author: req.user._id,
            post: req.body.post,
            image: req.file
                ? req.file.path.replace(/.*\/public\/images\//, "/images/")
                : null,
        });

        // Save the new Post to DB
        await newPost.save();
        res.redirect("/profile");
    })
);

// POST for post likes
router.post(
    "/likes",
    asyncHandler(async (req, res, next) => {
        const postId = req.body.postId; // retrieve related postId from form (saves as a string)
        const currentUser = req.user._id; // define current users id

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
