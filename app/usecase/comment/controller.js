const { comment } = require("@models")

exports.getCommentByPostId = async (req, res) => {
    const { postId } = req.params
    try {
        let comments = await comment.findAll({
            where: {
                post_id: postId
            }
        })
        comments = JSON.parse(JSON.stringify(comments))

        res.status(200).json({
            status: "success",
            message: `Get comment by post id ${postId} success`,
            data: { comments }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.addComment = async (req, res) => {
    const { id } = req.user
    const { post_id, comment } = req.body
    try {
        let newComment = await comment.create({ user_id: id, post_id, comment })
        newComment = JSON.parse(JSON.stringify(newComment))

        res.status(200).json({
            status: "success",
            message: "Add comment success",
            data: { newComment }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}