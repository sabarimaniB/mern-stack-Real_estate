import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
    res.json({
        message: 'API route is working!',
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You can only update your own account.'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        if (!updateUser) {
            return next(errorHandler(404, 'User not found.'));
        }

        const { password, ...rest } = updateUser;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account.'));
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return next(errorHandler(404, 'User not found.'));
        }
        res.clearCookie('access_token');
        res.status(200).json({ message: 'User has been deleted.' });
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ useRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings.'));
    }
};
