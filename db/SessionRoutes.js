import express from 'express';
import bcrypt from 'bcrypt';
import models from './models/';

import passport from 'passport';

var router = express.Router();

router.post('/login', passport.authenticate('local', (err, user, info) => {
    if (req.xhr) {
        if (err) {
            res.status(500).json({success: false, message: 'Failed to login.'});
            return;
        } else if (!user) {
            res.status(400).json({success: false, message: 'Failed to login.'});
            return;
        }
    } else {
        if (err || !user) {
            req.flash('error', 'Failed to login.');
            res.redirect('/login');
            return;
        }
    }
    req.logIn(user, (err) => {
        if (req.xhr) {
            if (err) {
                res.status(401).json({success: false, message: 'Failed to login.'});
                return;
            } else {
                res.status(200).json({success: true, message: 'Successfully logged in.'});
                return;
            }
        } else {
            if (err) {
                req.flash('error', 'Failed to login.');
                res.redirect('/login');
                return;
            } else {
                req.flash('success', 'Successfully logged in.');
                res.redirect('/');
                return;
            }
        }
    });
}));

router.get('/logout', (req, res) => {
    req.logout();
    if (req.xhr) {
        res.status(200).json({success: true, message: 'You have been logged out.'});
    } else {
        req.flash('success', 'You have been logged out.');
        res.redirect('/');
    }
});

export default router;
