const Printer = require("../models/printer");
const Status = require("../models/status");
const Print = require("../models/print");
const e = require("express");

let printerController = {};

// Admin can use this to add printer if they get a new printer
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

// Deletes a printer from the database
printerController.deletePrinter = async (req, res, next) => {
    try {
        let printer_id = req.body.printer_id;
        await Printer.deleteOne({_id: printer_id});
        res.send("Printer Deleted Successfully");
    } catch (error) {
        next(error)
    }
}

// Returns all available printers
printerController.getPrinters = async (req, res, next) => {
    try {
        let allPrinters = await Printer.find({});

        res.send(allPrinters)
    } catch (error) {
        next(error)
    }
}

// Returns a specific printer using the printer id
printerController.getPrinter = async (req, res, next) => {
    try {
        const { printer_id } = req.params;
        let printer = await Printer.find({_id: printer_id});

        res.send(printer)
    } catch (error) {
        next(error)
    }
}

// Returns all the printers of the logged in user using the user id from the header
printerController.getUserPrinters = async  (req, res, next) => {
    try {
        let user_id = req.user._id;
        let user_printers = await Printer.find({access_user_id: {$in: [user_id]}});
        res.send(user_printers)
    } catch (error) {
        next(error);
    }
}

// Returns the printers of a specific user chosen by the admin using the user id
printerController.getOtherUserPrinters = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        let user_printers = await Printer.find({access_user_id: {$in: [user_id]}})
        res.send(user_printers);
    } catch (error) {
        next(error);
    }
}

// Returns the printers that a certain user cannot access for the admin view
printerController.getOtherUserOtherPrinters = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        let user_printers = await Printer.find({access_user_id: {$ne: [user_id]}})
        res.send(user_printers);
    } catch (error) {
        next(error);
    }
}

// Gives user access to a printer which is also defined by the admin
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

// Removes user access from printer
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

// Changes printer status based if it's being used or not for simulation purposes
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

// Adds print to the printer and starts simulating a print with a random duration between 2 and 10 hours
printerController.addPrint = async (req, res, next) => {
    try {
        let _id = req.body.printer_id;
        let file_name = req.body.file_name;
        let user_id = req.user._id;

        let all_prints = await Print.find({});
        let printing_duration = Math.floor(Math.random() * (36000000 - 7200000 + 1)) + 7200000;
        let print;
        if (all_prints.length === 0) {
            let print_start_time = new Date().getTime();
            print = new Print({
                user_id: user_id,
                file_name: file_name,
                printer_id: _id,
                print_start_time: print_start_time,
                print_end_time: print_start_time + printing_duration,
                active: true,
                duration: printing_duration
            });
        } else {
            print = new Print({
                user_id: user_id,
                file_name: file_name,
                printer_id: _id,
                duration: printing_duration
            });
        }

        await print.save();

        await Printer.updateOne({_id: _id}, {$push: {printing_queue: print._id}}, {new: true, upsert: true, multi: true});

        res.send("Print Added Successfully");
    } catch (error) {
        next(error);
    }
}

// Ends print simulation by adding print to the finished_prints queue in the database
printerController.endPrint = async (req, res, next) => {
    try {
        let print_id = req.body.print_id;
        let print = await Print.find({_id: print_id});

        await Printer.updateOne({_id: print.printer_id}, {printing_queue: {$pull: [print_id]}}, {new: true, upsert: true, multi: true});
        await Printer.updateOne({_id: print.printer_id}, {finished_prints: {$push: [print_id]}}, {new: true, upsert: true, multi: true});

        await Printer.find({_id: print.printer_id}, {'printing_queue': {$slice: 1}});
        // db.getFirstElementInArrayDemo.find({},{"StudentSubject":{$slice:1}});

        res.send("Print ended successfully");
    } catch (error) {
        next(error);
    }
}

module.exports = printerController;