const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

/* GET Contact page. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        const successMessage = req.flash("successMessage");
        const errorMessage = req.flash("errorMessage");

        // Clear the flash messages after declaring to prevent render on next load
        req.flash("successMessage", null);
        req.flash("errorMessage", null);

        res.render("contactUs", {
            title: "Contact Us",
            user: req.user,
            currentPage: "/contact",
            // If the flash message is 0, return null.
            successMessage: successMessage.length > 0 ? successMessage : null,
            errorMessage: errorMessage.length > 0 ? errorMessage : null,
        });
    })
);

/* POST Contact form submission. */
router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        const { name, email, message, userRealName, userName, userId } =
            req.body;

        // Validate required fields
        if (!name || !message) {
            console.log(
                "Tried to send blank email. ---------------------------------------------------------------------------"
            );
            req.flash("errorMessage", "Please provide name and message");
            return res.redirect("/contact");
        }

        const mailOptions = {
            from: {
                name: "SOCIAL PAGE",
                address: process.env.USER_EMAIL,
            },
            to: process.env.MY_EMAIL,
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `<h3>Form Input</h3>
                   <p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>
                   <h3>User Info</h3>
                   <p><strong>Users Name:</strong> ${userRealName}</p>
                   <p><strong>Username:</strong> ${userName}</p>
                   <p><strong>UserId:</strong> ${userId}</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(
                "Email has been sent!--------------------------------------------------------------------------------"
            );
            req.flash("successMessage", "Email has been sent!");
            return res.redirect("/contact");
        } catch (error) {
            console.error(error);
            req.flash("errorMessage", "Error Sending Email");
            res.redirect("/contact");
        }
    })
);

module.exports = router;
