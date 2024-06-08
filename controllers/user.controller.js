const bcrypt = require('bcryptjs');

const {User} = require("../models/user.model");

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-passwordHash');
        if (!users) {
            res.status(500).send('Not Found');
        }
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

exports.addUser = async (req, res, next) => {
    try {
        const body = req.body;
        let user = new User({
            name: body.name,
            email: body.email,
            passwordHash: bcrypt.hashSync(body.password, 10),
            street: body.street,
            apartment: body.apartment,
            city: body.city,
            zip: body.zip,
            country: body.country,
            phone: body.phone,
            isAdmin: body.isAdmin,
        });

        user = await user.save();
        if (!user) {
            res.status(404).send('Failed to add user');
        }
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            return res.status(200).json({
                success: true,
                message: "The user has been deleted successfully"
            });
        }
        return res.status(404).json({
            success: false,
            message: "Fail to delete user"
        });
    } catch (error) {
        return res.status(400).json({success: false, error});
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id
        }).select('-passwordHash');
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({
            message: "User not found"
        });
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.updateUser = async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {
            name: body.name,
            street: body.street,
            apartment: body.apartment,
            city: body.city,
            zip: body.zip,
            country: body.country,
            phone: body.phone,
        }, {new: true});
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({error});
    }
}