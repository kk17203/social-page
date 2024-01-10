const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    profile_picture: {
        type: String,
        default: "/images/cartoon-rocket-ai-crop.jpg",
    },
    loginHistory: [
        {
            timestamp: { type: Date, default: Date.now },
            ipAddress: { type: String },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followed: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of ref to other users they follow
});

//Virtual for author's full name
UserSchema.virtual("name").get(function () {
    fullname = `${this.first_name} ${this.last_name}`;

    return fullname;
});

// Virtual for formatted phone number
UserSchema.virtual("formattedPhone").get(function () {
    // Remove non-numeric characters from the phone number
    const numericPhone = this.phone.replace(/\D/g, "");

    // Format the numeric phone number as 555.555.5555
    const formattedPhone = numericPhone.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "$1.$2.$3"
    );

    return formattedPhone;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
