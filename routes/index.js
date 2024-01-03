const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
    // See if user is still logged in
    if (req.user) {
        return res.redirect("/dashboard");
    }

    res.render("index", { title: "Index" });
});

module.exports = router;
