const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: String, required: true },
    comments: [{ type: String }],
    likes: { type: String },
    timestamp: { type: Date, default: Date.now },
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
