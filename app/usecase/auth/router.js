const express = require('express');
const router = express.Router();

const { register, login, facebookLogin, editProfile } = require("./controller")
const passport = require('passport');
const auth = require('@middlewares/auth');

router.post("/register", register);
router.post("/login", login);
router.put("/edit-profile", auth, editProfile);

//facebook routes
router.get("/auth/facebook", passport.authenticate('facebook'));
router.get('/facebookLogin', passport.authenticate("facebook"), facebookLogin)

module.exports = router;