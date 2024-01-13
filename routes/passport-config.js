const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                const processedUsername = username.toLowerCase().trim();

                try {
                    const user = await User.findOne({
                        username: processedUsername,
                    });
                    if (!user) {
                        return done(null, false, {
                            message: "Incorrect username",
                        });
                    }
                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    ); // Matches bcryptjs passwords
                    if (!isMatch) {
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }

                    // login history logic
                    const newLoginHistory = {
                        timestamp: new Date(),
                        ipAddress: req.ip,
                    };

                    user.loginHistory.push(newLoginHistory);
                    await user.save();

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
