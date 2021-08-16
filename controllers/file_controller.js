const File = require("../models/file");
const Status = require("../models/status");
const { PythonShell } = require('python-shell');

let fileController = {};


fileController.uploadFile = (req, res, next) => {
    try {
        let user_id = req.user._id;
        let file_original_name;
        let file_new_name;

        if (req.file) {
            file_new_name = req.file.filename;
            file_original_name = req.file.filename;
            file_original_name = file_original_name.split("|")[2];
        } else {
            file_new_name = 'notFile.gcode';
        }

        const newFile = new File({
            original_name: file_original_name,
            new_name: file_new_name,
            user_id: user_id
        });
        newFile.save();
        res.send({original_name: req.file.originalname, upload_name: req.file.filename})
    } catch (error) {
        next(error);
    }
};

fileController.saveDownloadURL = (req, res, next) => {
    try {
        let user_id = req.body._id;
        let file_name = req.body.file_name;
        let original_name = req.body.original_name;
        let download_url = req.body.download_url;

        const newFile = new File({
            file_name: file_name,
            original_name: original_name,
            download_url: download_url,
            user_id: user_id
        });

        newFile.save();
        res.send({ message: "Upload Successful"});
    }
    catch (error) {
        next(error);
    }
};

fileController.deleteFile = async (req, res, next) => {
    try {
        const fileId = req.body.file._id;
        await Status.deleteMany({file_id: fileId});
        await File.deleteOne({_id: fileId});
        res.send({message: "File Deleted Successfully"});
    } catch (error) {
        next(error);
    }
};

fileController.getFiles = async (req, res, next) => {
    try {
        const files = {};
        const allFiles = await File.find(files).where("user_id").equals(req.body._id).sort({created: "desc"});
        res.send(allFiles);
    } catch (error) {
        next(error);
    }
};

fileController.getFileAsString = async (req, res, next) => {
    try {
        let file_id = req.body._id;
        await File.findOne({_id: file_id}, (err, file) => {
            // const pythonPath = path.join(__dirname, '../python/main.py');
            const pythonPath = "python/main.py";
            const url = file.download_url;

            let options = {
                mode: 'text',
                args: [url]
            };

            PythonShell.run(pythonPath, options, (err, results) => {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                res.status(200).send({data: results.join("\n")});
            });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = fileController;
