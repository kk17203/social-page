const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

// Below list required for login via passport
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
require("./routes/passport-config")(passport); //Link to passport config file
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const signupRouter = require("./routes/signup");
const logoutRouter = require("./routes/logout");
const dashboardRouter = require("./routes/dashboard");
const profileRouter = require("./routes/profile");
const userPageRouter = require("./routes/user-page");
const contactUsRouter = require("./routes/contact-us");
const adminPageRouter = require("./routes/admin-page");
const featuresRouter = require("./routes/features");
const aboutRouter = require("./routes/about-us");

const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
    console.log("CONNECTING TO DATABASE");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DATABASE CONNECTION SUCCESS");
}

//Set up rate limiter: max of 20 requests per min
// const RateLimit = require("express-rate-limit");
// const limiter = RateLimit({
//     windowMs: 1 * 60 * 1000, // 1 Min
//     max: 500,
// });
// // Apply rate limiter to all requests
// app.use(limiter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Below section for login via passport
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    // Gives views access to currentUser
    res.locals.currentUser = req.user;
    next();
});

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
//         },
//     })
// );

// app.use(compression()); // Compress all routes

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/dashboard", dashboardRouter);
app.use("/profile", profileRouter);
app.use("/userPage", userPageRouter);
app.use("/contact", contactUsRouter);
app.use("/admin", adminPageRouter);
app.use("/features", featuresRouter);
app.use("/about", aboutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
