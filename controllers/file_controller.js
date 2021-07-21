const File = require("../models/model_file");
const path = require("path");

let fileController = {};


fileController.uploadFile = (req, res, next) => {
    let user_id = req.user._id;
    let file_original_name;
    let file_new_name;

    if (req.file) {
        file_new_name = req.file.filename;
        file_original_name = req.file.filename;
        file_original_name = file_original_name.split("_")[2];
    } else {
        file_new_name = 'notFile.gcode';
    }

    const newFile = new File({
        original_name: file_original_name,
        new_name: file_new_name,
        user_id: user_id
    });
    newFile.save();
    return res.send({original_name: req.file.originalname, upload_name: req.file.filename})
};

fileController.downloadFile = (req, res, next) => {
    let temp_file = path.join(__dirname,'../uploads') +'/'+ req.body.file_name;
    console.log(temp_file);
    res.sendFile(temp_file);
};

fileController.deleteFile = async (req, res, next) => {
    try {
        const fileId = req.body.file._id;
        const fs = require('fs');
        const filePath = path.join(__dirname,'../uploads') +'/'+ req.body.file.new_name;
        fs.rm(filePath, { recursive:true }, (err) => {
            if(err){
                console.error(err.message);
                return;
            }
            console.log("File deleted successfully");
        });
        await File.deleteOne({_id: fileId});
        res.send({message: "File Deleted Successfully"});
    } catch (error) {
        next(error);
    }
};

fileController.getFiles = async (req, res, next) => {
    try {
        const files = {};
        const allFiles = await File.find(files).where("user_id").equals(req.body._id);
        res.send(allFiles);
    } catch (error) {
        next(error);
    }
};

module.exports = fileController;
