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
                callbackURL: process.env.CALLBACK_FB_API,
            },
            async function (accessToken, refreshToken, profile, done) {
                // console.log("fb profile", profile);
                console.log("fb id", profile.id);
                try {
                    // let userExist = await user.findOne({
                    //     where: { fb_id: profile.id },
                    //     include: { model: customer }
                    // })
                    // userExist = JSON.parse(JSON.stringify(userExist));

                    // if (!userExist) {
                    //     const salt = await bcrypt.genSalt(10);
                    //     const hashedPassword = await bcrypt.hash("123456", salt);

                    //     let newUser = await user.create({
                    //         fb_id: profile.id,
                    //         // email: profile.emails[0]?.value,
                    //         email: profile.provider,
                    //         name: profile.displayName,
                    //         username: profile.displayName,
                    //         password: hashedPassword,
                    //         email_verified_at: fn("now")
                    //     }, { attributes: { exclude: ["password"] } });
                    //     newUser = JSON.parse(JSON.stringify(newUser));

                    //     let newCustomer = await customer.create({});
                    //     newCustomer = JSON.parse(JSON.stringify(newCustomer));

                    //     return done(null, { newUser, newCustomer });
                    // } else {
                    //     return done(null, userExist);
                    // }
                } catch (error) {
                    throw error.message
                }
            }
        )
    );
}