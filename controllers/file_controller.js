const File = require("../models/file");
const Status = require("../models/status");
const { PythonShell } = require('python-shell');

let fileController = {};

// Adds the file information to the database,
// the file itself it uploaded directly from the frontend to firebase storage
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

// Removes file information from the database
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

// Returns all files for a specific user based on user id from the header
fileController.getFiles = async (req, res, next) => {
    try {
        const files = {};
        const allFiles = await File.find(files).where("user_id").equals(req.user._id).sort({created: "desc"});
        res.send(allFiles);
    } catch (error) {
        next(error);
    }
};

// This function will return a gcode file as a string instead of a file
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

            // Runs a python script that reads the gcode file and returns the data inside as a string
            // it is then sent to the frontend to be rendered
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
