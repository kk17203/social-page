const express = require("express");
const router = express.Router();
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const User = require("../models/users");

/* GET home page. */
router.get("/", (req, res, next) => {
    // See if user is still logged in
    if (req.user) {
        return res.redirect("/dashboard");
    }

    res.render("index", { title: "Index" });
});

// POST for log-in form
router.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        failureFlash: true,
    })
);

module.exports = router;
