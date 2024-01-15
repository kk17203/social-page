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

        res.render("features", {
            title: "Features",
            user: req.user,
            currentPage: "/features",
        });
    })
);

module.exports = router;
