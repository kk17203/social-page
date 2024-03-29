const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/users");
const path = require("path");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");

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

        const posts = await Post.find({
            author: req.user._id,
        })
            .populate("comments.author")
            .sort({ timestamp: -1 })
            .populate("author"); // Find all Posts and Populate the 'author' field in the 'posts' array

        console.log(posts);

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

        await User.findByIdAndUpdate(userId, {
            profile_picture: selectedPic,
        });
        res.redirect("/profile");
    })
);

// Google Cloud Storage key as a JSON object
const keyFileContent = {
    type: process.env.FILE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.FILE_PRIVATE_KEY_ID,
    private_key: process.env.FILE_PRIVATE_KEY,
    client_email: process.env.FILE_CLIENT_EMAIL,
    client_id: process.env.FILE_CLIENT_ID,
};

// Initialize google cloud storage
const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: keyFileContent,
});

const bucket = storage.bucket(process.env.GOOGLE_BUCKET);

// Set up Multer storage for image uploads
const multerStorage = multer.memoryStorage();

// Set up Multer config with Google Cloud Storage
const upload = multer({
    storage: multerStorage,
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
        try {
            const file = req.file;

            if (!file) {
                console.log("No file provided");
                const newPost = new Post({
                    author: req.user._id,
                    author_name: req.user.name,
                    author_username: req.user.username,
                    post: req.body.post,
                    image: null,
                });

                // Save the new Post to DB
                await newPost.save();

                return res.redirect("/profile");
            }

            const fileName = `${uuidv4()}-${file.originalname}`;
            const blob = bucket.file(fileName);

            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on("error", (err) => {
                console.error(err);
                res.status(500).json({ error: "Failed to upload file" });
            });

            blobStream.on("finish", async () => {
                const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                const newPost = new Post({
                    author: req.user._id,
                    author_name: req.user.name,
                    author_username: req.user.username,
                    post: req.body.post,
                    image: imageUrl,
                });

                // Save the new Post to DB
                await newPost.save();
                res.redirect("/profile");
            });
            blobStream.end(file.buffer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
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
            author_name: req.user.name,
            author_username: req.user.username,
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
