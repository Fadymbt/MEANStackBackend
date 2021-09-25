const Comment = require("../models/comment");
const Status = require("../models/status");
const User = require("../models/user");

let commentController = {};

commentController.addComment = async (req, res, next) => {
    try {
        let user_id = req.user._id;
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

        Comment.find({status_id: status_id}, (error, comments) => {
            let allComments = [];

            comments.forEach((comment) => {
                User.findOne({_id: comment.user_id}, (error, user) => {
                    allComments.push({first_name: user.first_name, last_name: user.last_name, user_name: user.user_name, profile_picture: user.profile_picture, comment: comment});
                    if (allComments.length === comments.length) {
                        allComments.sort((a, b) => {
                            return new Date(a.comment.created).getTime() - new Date(b.comment.created).getTime();
                        });
                        res.send(allComments);
                    }
                })
            });
        });
    } catch (error) {
        next(error)
    }
}

module.exports = commentController;