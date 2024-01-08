const moment = require("moment");
const mongoose = require("mongoose");

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
    likes: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Array of ref to users who like the post
    timestamp: { type: Date, default: Date.now },
});

// Virtual field for formatted timestamp
PostSchema.virtual("formattedTimestamp").get(function () {
    // Format the date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(this.timestamp);

    return formattedDate;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
