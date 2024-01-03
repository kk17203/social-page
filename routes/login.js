const express = require("express");
const router = express.Router();
const passport = require("passport");

// GET login page
router.get("/", (req, res, next) => {
    res.render("login");
});

// POST for sign-up form
router.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

module.exports = router;
