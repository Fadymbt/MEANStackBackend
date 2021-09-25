const Printer = require("../models/printer");
const Status = require("../models/status");
const e = require("express");

let printerController = {};

printerController.addPrinter = async (req, res, next) => {
    try {
        let printer_name = req.body.printer_name;
        const printer = new Printer({
            name: printer_name
        });
        await printer.save();
        res.send("Printer Added Successfully");
    } catch (error) {
        next(error);
    }
}

printerController.deletePrinter = async (req, res, next) => {
    try {
        let printer_id = req.body.printer_id;
        await Printer.deleteOne({_id: printer_id});
        res.send("Printer Deleted Successfully");
    } catch (error) {
        next(error)
    }
}

printerController.getPrinters = async (req, res, next) => {
    try {
        let allPrinters = await Printer.find({});

        res.send(allPrinters)
    } catch (error) {
        next(error)
    }
}

printerController.getUserPrinters = async  (req, res, next) => {
    try {
        let user_id = req.user._id;
        let user_printers = await Printer.find({access_user_id: {$in: [user_id]}});
        res.send(user_printers)
    } catch (error) {
        next(error);
    }
}

printerController.getOtherUserPrinters = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        let user_printers = await Printer.find({access_user_id: {$in: [user_id]}})
        res.send(user_printers);
    } catch (error) {
        next(error);
    }
}

printerController.getOtherUserOtherPrinters = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        let user_printers = await Printer.find({access_user_id: {$ne: [user_id]}})
        res.send(user_printers);
    } catch (error) {
        next(error);
    }
}

printerController.addUserToPrinter = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let printer_id = req.body.printer_id;

        await Printer.updateOne({_id: printer_id}, {$push: {access_user_id: user_id}}, {new: true, upsert: true});

        res.send("User Access Updated Successfully");
    } catch (error) {
        next(error)
    }
}

printerController.removeUserFromPrinter = async (req, res, next) => {
    try {
        let user_id = req.body.user_id;
        let printer_id = req.body.printer_id;

        await Printer.updateOne({_id: printer_id}, {$pull: {access_user_id: user_id}}, {new: true, upsert: true, multi: true});

        res.send("User Access Updated Successfully");
    } catch (error) {
        next(error);
    }
}

printerController.changePrinterStatus = async (req, res, next) => {
    try {
        let _id = req.body.printer_id;
        let status = req.body.status;

        await Printer.updateOne({_id: _id}, {$push: {status: status}}, {new: true, upsert: true, multi: true});

        res.send("Printer Status Changed Successfully");
    } catch (error) {
        next(error);
    }
}

startPrint = (_id, user_id, file_name, printing_duration) => {
    let printer = Printer.find({_id: _id});
    let current_print;

    if (printer.queue.length > 0) {
        if (!printer.queue[0].active) {
            current_print = printer.queue[0];
            current_print.active = true;
            current_print.print_start_time = new Date().getTime();
            current_print.print_end_time = current_print.print_start_time + current_print.duration;
            Printer.updateOne({_id: _id, queue: {user_id: user_id, file_name: file_name, duration: printing_duration}}, {$push: {queue: current_print}}, {new: true, upsert: true, multi: true});
        }
    }
}

printerController.addPrint = async (req, res, next) => {
    try {
        let _id = req.body.printer_id;
        let file_name = req.body.file_name;
        let user_id = req.user._id;

        let printing_duration = Math.floor(Math.random() * (36000000 - 7200000 + 1)) + 7200000;

        await Printer.updateOne({_id: _id}, {$push: {queue: {user_id: user_id, file_name: file_name, duration: printing_duration}}}, {new: true, upsert: true, multi: true});

        startPrint(_id, user_id, file_name, printing_duration);

        res.send("Print Added Successfully");
    } catch (error) {
        next(error);
    }
}

module.exports = printerController;