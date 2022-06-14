const express = require('express');
const router = express.Router();

const { register, login, facebookLogin } = require("./controller")
const passport = require('passport');

router.post("/register", register);
router.post("/login", login);

//facebook routes
router.get("/auth/facebook", passport.authenticate('facebook'));
router.get('/facebookLogin', passport.authenticate("facebook"), facebookLogin)

module.exports = router;