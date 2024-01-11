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

        res.render("contactUs", {
            title: "Contact Us",
            user: req.user,
            currentPage: "/contact",
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
            return res.render("contactUs", {
                title: "Contact Us",
                user: req.user,
                currentPage: "/contact",
                errorMessage: "Please provide name, email, and message.",
            });
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
            // Make sure user is logged in
            if (!req.user) {
                return res.redirect("/");
            }

            res.redirect("/");
        } catch (error) {
            console.error(error);
            // Make sure user is logged in
            if (!req.user) {
                return res.redirect("/");
            }

            res.render("contactUs", {
                title: "Contact Us",
                user: req.user,
                currentPage: "/contact",
                errorMessage: "Error sending email.",
            });
        }
    })
);

module.exports = router;