const Comment = require("../models/comment");
const Status = require("../models/status");
const File = require("../models/file");
const e = require("express");

let commentController = {};

commentController.addComment = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let status_id = req.body.status_id;
        let content = req.body.content;

        const newComment = new Comment({
            user_id: user_id,
            status_id: status_id,
            content: content
        })

        await newComment.save();
        res.send({message: "Comment Added Successfully"})
    } catch (error) {
        next(error);
    }
}

commentController.deleteComment = async (req, res, next) => {
    try {
        const comment_id = req.body.comment_id;

        await Comment.deleteOne({_id: comment_id});
        res.send({message: "Comment Deleted Successfully"});
    } catch (error) {
        next(error)
    }
}

commentController.getStatusComments = async (req, res, next) => {
    try {
        const { status_id } = req.params;
        const comments = {};
        const allComments = await Comment.find(comments).where("status_id").equals(status_id).sort({created: "asc"});
        res.send(allComments);
    } catch (error) {
        next(error)
    }
}

module.exports = commentController;