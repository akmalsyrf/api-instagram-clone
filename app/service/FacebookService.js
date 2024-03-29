const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const { user } = require("@models");
const { fn } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FB_API_KEY,
                clientSecret: process.env.FB_API_SECRET,
                callbackURL: `${process.env.BASE_URL}/facebookLogin`,
            },
            async function (accessToken, refreshToken, profile, done) {
                // console.log("fb profile", profile);
                console.log("fb id", profile.id);
                try {
                    let userExist = await user.findOne({
                        where: { fb_id: profile.id },
                    })
                    userExist = JSON.parse(JSON.stringify(userExist));

                    if (!userExist) {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash("123456", salt);

                        let newUser = await user.create({
                            fb_id: profile.id,
                            email: profile.provider,
                            name: profile.displayName,
                            username: profile.displayName,
                            password: hashedPassword,
                            email_verified_at: fn("now")
                        }, { attributes: { exclude: ["password"] } });
                        newUser = JSON.parse(JSON.stringify(newUser));

                        return done(null, { newUser });
                    } else {
                        return done(null, userExist);
                    }
                } catch (error) {
                    done(error);
                    throw error.message
                }
            }
        )
    );
}