const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    followed: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Array of ref to other users they follow
});

//Virtual for author's full name
UserSchema.virtual("name").get(function () {
    fullname = `${this.first_name} ${this.last_name}`;

    return fullname;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
