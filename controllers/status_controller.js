const Status = require("../models/status");
const User = require("../models/user");

let statusController = {};

// Adds status that has been posted by the user
statusController.addStatus = async (req, res, next) => {
    try {
        let user_id = req.user._id;
        let content = req.body.data.content;
        let file_id;
        let newFile;

        if (req.body.data.file_id === undefined) {
            newFile = new Status({
                content: content,
                user_id: user_id
            });
        } else {
            file_id = req.body.data.file_id;
            newFile = new Status({
                content: content,
                file_id: file_id,
                user_id: user_id
            });
        }

        newFile.save();
        res.status(200).json({message: "Status Updated"});
    } catch (error) {
        next(error);
    }
};

// Returns all statuses of all users based on the date they were posted
statusController.getAllStatuses = (req, res, next) => {
    try {
        Status.find({},  (error, statuses) => {
            let allStatuses = [];

            statuses.forEach((status) => {
                User.findOne({_id: status.user_id}, (error, user) => {
                    allStatuses.push({first_name: user.first_name, user_name: user.user_name, profile_picture: user.profile_picture, status: status});
                    if (allStatuses.length === statuses.length) {
                        allStatuses.sort((a, b) => {
                            return new Date(b.status.created).getTime() - new Date(a.status.created).getTime();
                        });
                        res.send(allStatuses);
                    }
                })
            });
        });
    } catch (error) {
        next(error);
    }
};

// Returns only the statuses of the logged in user
statusController.getUserStatuses = async (req, res, next) => {
    try {
        let userId = req.user._id;
        console.log(userId);
        let statuses = {};
        statuses = await Status.find({user_id: userId}).sort({created: "desc"});
        res.send(statuses);
    } catch (error) {
        next(error);
    }
};

// Deletes status based on the status id
statusController.deleteStatus = async (req, res, next) => {
    try {
        const statusId = req.body._id;
        await Status.deleteOne({_id: statusId});
        res.send({message: "Status Deleted Successfully"});
    } catch (error) {
        next(error);
    }
};

// Likes a status by adding the user id of the user that liked the status to the array liked_by
statusController.likeStatus = async (req, res, next) => {
    try {
        let user_id = req.user._id;
        let status_id = req.body.status_id;
        console.log(user_id);
        console.log(status_id);

        await Status.updateOne({_id: status_id}, {$push: {liked_by: user_id}}, {new: true, upsert: true});

        res.send({message: "Status Liked Successfully"});
    } catch (error) {
        next(error)
    }
}

// disliked status by removing the user id from the array liked_by
statusController.dislikeStatus = async (req, res, next) => {
    try {
        let user_id = req.user._id;
        let status_id = req.body.status_id;

        await Status.updateOne({_id: status_id}, {$pull: {liked_by: user_id}}, {new: true, upsert: true});

        res.send({message: "Status Disliked Successfully"});
    } catch (error) {
        next(error)
    }
}

module.exports = statusController;
