const express = require("express")
const router = express.Router()

const { getAllPost, getPostsByUserId, getPostById, addPost } = require("./controller")
const auth = require('@middlewares/auth')

router.get("/posts", getAllPost)
router.get("/posts/:id", getPostById)
router.get("/post/user/:userId", getPostsByUserId)
router.post("/post", auth, addPost)

module.exports = router