const jwt = require('jsonwebtoken');
const User = require('../models/user');


const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode._id);
        if (!user.is_admin) throw new Error();
        next();
    } catch (error) {
        res.status(401).send({ message: "Unauthorized Access" });
    }
};

module.exports = adminAuth;
