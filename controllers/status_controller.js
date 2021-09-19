const Status = require("../models/status");
const User = require("../models/user");

let statusController = {};


statusController.addStatus = async (req, res, next) => {
    try {
        let content = req.body.data.content;
        let user_id = req.body.user_id;
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

statusController.getAllStatuses = (req, res, next) => {
    try {
        Status.find({},  (error, statuses) => {
            let allStatuses = [];

            statuses.forEach((status) => {
                User.findOne({_id: status.user_id}, (error, user) => {
                    allStatuses.push({first_name: user.first_name, user_name: user.user_name, status: status});
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

statusController.getUserStatuses = async (req, res, next) => {
    try {
        let userId = req.body._id;
        let statuses = {};
        statuses = await Status.find({user_id: userId}).sort({created: "desc"});
        res.send(statuses);
    } catch (error) {
        next(error);
    }
};

statusController.deleteStatus = async (req, res, next) => {
    try {
        const statusId = req.body._id;
        await Status.deleteOne({_id: statusId});
        res.send({message: "Status Deleted Successfully"});
    } catch (error) {
        next(error);
    }
};

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
