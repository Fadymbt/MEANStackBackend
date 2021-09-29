const Printer = require("../models/printer");
const Status = require("../models/status");
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

// Starts simulating a print by adding the generated information from the addPrint function
startPrint = (_id, user_id, file_name, printing_duration) => {
    let printer = Printer.find({_id: _id});
    let current_print;

    if (printer.printing_queue.length > 0) {
        if (!printer.printing_queue[0].active) {
            current_print = printer.queue[0];
            current_print.active = true;
            current_print.print_start_time = new Date().getTime();
            current_print.print_end_time = current_print.print_start_time + current_print.duration;
            Printer.updateOne({_id: _id, printing_queue: {user_id: user_id, file_name: file_name, duration: printing_duration}}, {$push: {printing_queue: current_print}}, {new: true, upsert: true, multi: true});
        }
    }
}

// Adds print to the printer and starts simulating a print with a random duration between 2 and 10 hours
printerController.addPrint = async (req, res, next) => {
    try {
        let _id = req.body.printer_id;
        let file_name = req.body.file_name;
        let user_id = req.user._id;

        let printing_duration = Math.floor(Math.random() * (36000000 - 7200000 + 1)) + 7200000;

        await Printer.updateOne({_id: _id}, {$push: {printing_queue: {user_id: user_id, file_name: file_name, duration: printing_duration}}}, {new: true, upsert: true, multi: true});

        startPrint(_id, user_id, file_name, printing_duration);

        res.send("Print Added Successfully");
    } catch (error) {
        next(error);
    }
}

// Ends print simulation by adding print to the finished_prints queue in the database
printerController.endPrint = async (req, res, next) => {
    try {
        let printer_id = req.body.printer_id;
        let print_id = req.body.print_id;
        let print = await Printer.find({printing_queue: {$in: {_id: print_id}}});

        await Printer.updateOne({_id: printer_id}, {printing_queue: {$pull: {_id: print_id}}}, {new: true, upsert: true, multi: true});

        let finished_print = {
            user_id: await print.user_id,
            file_name: await print.file_name,
            print_start_time: await print.print_start_time,
            print_end_time: await print.print_end_time,
            duration: await print.duration
        }

        await Printer.updateOne({_id: _id}, {$push: {finished_prints: finished_print}}, {new: true, upsert: true, multi: true});
        res.send("Print ended successfully");
    } catch (error) {
        next(error);
    }
}

module.exports = printerController;