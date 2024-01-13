const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

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

        res.render("dashboard", {
            title: "Dashboard",
            user: req.user,
            posts: posts,
            currentPage: "/dashboard",
            anchorInfo: {
                elementId: "headerDropDownBtn",
                anchorSide: "bottom",
            },
        });
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
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            console.log("Please upload a valid image file");
            return cb(new Error("Please upload a valid image file"));
        }
        cb(undefined, true);
    },
});

// POST for posts
router.post(
    "/",
    upload.single("image"), // Handle single upload
    asyncHandler(async (req, res, next) => {
        console.log(req.file);

        const relativePath = req.file.path.replace(
            /.*\/public\/images\//,
            "/images/"
        );

        const newPost = new Post({
            author: req.user._id,
            post: req.body.post,
            image: req.file ? relativePath : null,
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
        res.redirect("/dashboard");
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
        res.redirect("/dashboard");
    })
);

module.exports = router;
