const express = require('express');
const router = express.Router();

const { getCommentByPostId, addComment } = require("./controller")
const auth = require("@middlewares/auth")

router.get("/comment/:postId", getCommentByPostId)
router.post("/comment", auth, addComment)

module.exports = router