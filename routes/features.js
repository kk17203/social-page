const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

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

router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        // If the username is not employer and this is not the users first login. Redirect to dashboard.
        if (
            req.user.username !== "employer" &&
            req.user.loginHistory.length > 1
        ) {
            return res.redirect("/dashboard");
        }

        // if (req.user.username === "employer") {
        //     const mailOptions = {
        //         from: {
        //             name: "EMPLOYER LOGIN",
        //             address: process.env.USER_EMAIL,
        //         },
        //         to: process.env.MY_EMAIL,
        //         subject: "New Employer Login",
        //         text: `Login Info: ${req.user.formattedLastLogin}`,
        //         html: `<h3>Login Info</h3>
        //         <p>User: ${req.user.name}</p>
        //         <p>Username: ${req.user.username}</p>
        //            <p>Time: ${req.user.formattedLastLogin}</p>
        //            <p>Ip Address: ${req.user.formattedLastLoginIp}`,
        //     };

        //     try {
        //         await transporter.sendMail(mailOptions);
        //         console.log(
        //             "Email has been sent!--------------------------------------------------------------------------------"
        //         );
        //     } catch (error) {
        //         console.error(error);
        //     }
        // } else {

        if (req.user.username !== "employer") {
            /// EMAIL ADMIN IF A NEW USER LOGS IN ///
            const mailOptions = {
                from: {
                    name: "NEW USER LOGIN",
                    address: process.env.USER_EMAIL,
                },
                to: process.env.MY_EMAIL,
                subject: "New User Login",
                text: `Login Info: ${req.user.formattedLastLogin}`,
                html: `<h3>Login Info</h3>
                <p>User: ${req.user.name}</p>
                <p>Username: ${req.user.username}</p>
                   <p>Time: ${req.user.formattedLastLogin}</p>
                   <p>Ip Address: ${req.user.formattedLastLoginIp}`,
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(
                    "User Email has been sent!--------------------------------------------------------------------------------"
                );
            } catch (error) {
                console.error(error);
            }

            /// EMAIL NEW USER THEIR WELCOME EMAIL ON FIRST LOGIN ///
            const userMailOptions = {
                from: {
                    name: "Welcome!",
                    address: process.env.USER_EMAIL,
                },
                to: req.user.email,
                subject: "Welcome to Polk County Cycling!",
                text: `Welcome, ${req.user.name}! We want to take a moment to thank you for visiting Polk County Cycling! If you have any questions or feekback don't hesitate to contact us via our website or our email, pococycling@gmail.com.`,
                html: `<h3>Welcome, ${req.user.name}!</h3>
                <p>We want to take a moment to thank you for visiting Polk County Cycling! If you have any questions or feekback don't hesitate to contact us via our website or our email, pococycling@gmail.com.</p>
                <p>Have a GREAT DAY and don't forget to enjoy the ride!</p>
                <p>Sincerely,</p>
                <p>Polk County Cycling Club</p>`,
            };

            try {
                await transporter.sendMail(userMailOptions);
                console.log(
                    "New User Email has been sent!--------------------------------------------------------------------------------"
                );
            } catch (error) {
                console.error(error);
            }
        }
        // }

        res.render("features", {
            title: "Features",
            user: req.user,
            currentPage: "/features",
        });
    })
);

module.exports = router;
