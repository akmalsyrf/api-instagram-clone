const { post, user, comment, liker } = require("@models")

exports.getAllPost = async (req, res) => {
    const { limit, offset } = req.query
    try {
        let posts = await post.findAll({
            include: [
                { model: user, attributes: ['name'] },
                { model: liker, order: [["createdAt", "DESC"]], limit: 1 },
                { model: comment, include: { model: user, attributes: ['name'] }, limit: 2 },
            ],
            order: [["createdAt", "DESC"]],
            limit: limit ? Number(limit) : 10,
            offset: offset ? Number(offset) : 0,
        })
        posts = JSON.parse(JSON.stringify(posts))

        let countLiker;
        let countComment;
        posts.forEach(async (p) => {
            countLiker = await liker.count({
                where: { post_id: p.id }
            })
            countComment = await comment.count({
                where: { post_id: p.id }
            })
        })
        res.status(200).json({
            status: "success",
            message: `get ${posts.length} posts, limit: ${limit ? limit : 10}, offset: ${offset ? offset : 0}`,
            data: { posts, countComment, countLiker }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

exports.getPostById = async (req, res) => {
    const { id } = req.params
    try {
        let Post = await post.findOne({
            where: { id },
            include: [
                { model: user, attributes: ['name'] },
                { model: comment, include: { model: user, attributes: ['name'] } },
                { model: liker, order: [["createdAt", "DESC"]] }
            ],
        })
        res.status(200).json({
            status: "success",
            message: `get post by id ${id}`,
            data: { post: Post }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

exports.getPostsByUserId = async (req, res) => {
    const { userId } = req.params
    const { limit, offset } = req.query
    try {
        let posts = await post.findOne({
            where: { user_id: userId },
            include: [
                { model: user, attributes: ['name'] },
                { model: comment, include: { model: user, attributes: ['name'] } },
                { model: liker, order: [["createdAt", "DESC"]] }
            ],
            limit: limit ? Number(limit) : 20,
            offset: offset ? Number(offset) : 0,
        })
        posts = JSON.parse(JSON.stringify(posts))

        res.status(200).json({
            status: "success",
            message: `get posts by user id ${userId}`,
            data: { posts }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

exports.addPost = async (req, res) => {
    try {
        const user_id = req.users.id
        const { imageurl, caption } = req.body

        let newPost = await post.create({ user_id, imageurl, caption })
        newPost = JSON.parse(JSON.stringify(newPost))

        res.status(200).json({
            status: "success",
            message: `add new post`,
            data: { post: newPost }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}