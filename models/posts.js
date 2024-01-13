const moment = require("moment-timezone");
const mongoose = require("mongoose");
// const multer = require("multer");
// const sharp = require("sharp");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Virtual field for formatted createdAt
CommentSchema.virtual("formattedCreatedAt").get(function () {
    return moment(this.createdAt).fromNow();
});

const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: String, required: true },
    comments: [CommentSchema],
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Array of ref to users who like the post
    timestamp: { type: Date, default: Date.now },
});

// Virtual field for formatted timestamp
PostSchema.virtual("formattedTimestamp").get(function () {
    // Define timezone
    const timeZone = "America/Chicago";

    //Format the date with specific options and time zone
    const formattedDate = moment(this.timestamp)
        .tz(timeZone)
        .format("MMM D, YYYY [at] h:mm A");

    return formattedDate;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
