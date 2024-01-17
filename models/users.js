const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    adminPassword: { type: String },
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

// Virtual for formatted creation date and time
UserSchema.virtual("formattedCreatedAt").get(function () {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    return this.createdAt.toLocaleDateString("en-US", options);
});

// Virtual for loginHistory.timestamp
UserSchema.virtual("formattedLastLogin").get(function () {
    if (this.loginHistory.length > 0) {
        const lastLogin = this.loginHistory[this.loginHistory.length - 1];

        const lastLoginOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "America/Chicago",
        };

        return lastLogin.timestamp.toLocaleDateString(
            "en-US",
            lastLoginOptions
        );
    } else {
        return "No login history available.";
    }
});

// Virtual for last login ip address
UserSchema.virtual("formattedLastLoginIp").get(function () {
    if (this.loginHistory.length > 0) {
        const lastLogin = this.loginHistory[this.loginHistory.length - 1];

        return lastLogin.ipAddress;
    } else {
        return "No login history available.";
    }
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
