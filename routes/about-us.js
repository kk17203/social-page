const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        // Make sure user is logged in
        if (!req.user) {
            return res.redirect("/");
        }

        res.render("aboutUs", {
            title: "About Us",
            user: req.user,
            currentPage: "/about",
        });
    })
);

module.exports = router;
