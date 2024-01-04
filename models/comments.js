const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Export Model
module.exports = mongoose.model("Comment", CommentSchema);
