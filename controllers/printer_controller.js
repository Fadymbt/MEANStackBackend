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
        let user_id;
        if (req.user._id !== undefined) {
            user_id = req.user._id;
        }
        else {
            user_id = req.body.user_id;
        }
        let user_printers = await Printer.find({'user_id': {$in: [user_id]}});

        res.send(user_printers)
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

module.exports = printerController;