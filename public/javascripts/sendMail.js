const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" });

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

// const contactForm = document.getElementById("contactForm");

// contactForm.addEventListener("submit", async (event) => {
//     event.preventDefault();
// });

const mailOptions = {
    from: {
        name: "SOCIAL PAGE",
        address: process.env.USER_EMAIL,
    },
    to: process.env.MY_EMAIL, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Test Hello World?</b>", // html body
};

const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent!");
    } catch (error) {
        console.error(error);
    }
};

sendMail(transporter, mailOptions);
