
/*
declares all require variables of Mongoose models, Passport.js, JWT, Express Router, and
Configuration file.
*/

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");

//Create a router to register the new user using just a username and password

router.post('/register', function(req, res) {
    if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
    } else {
    var newUser = new User({
    username: req.body.username,
    password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
    if (err) {
    return res.json({success: false, msg: 'Username already exists.'});
    }
    res.json({success: true, msg: 'Successful created new user.'});
    });
    }
   });
   

   //Create a router for login or sign-in using username and password
   router.post('/login', function(req, res) {
    User.findOne({
    username: req.body.username
    }, function(err, user) {
    if (err) throw err;
    if (!user) {
    res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
    // check if password matches
    user.comparePassword(req.body.password, function (err, isMatch) {
    if (isMatch && !err) {
    // if user is found and password is right create a token
    var token = jwt.sign(user.toJSON(), config.secret);
    // return the information including token as JSON
    res.json({success: true, token: 'JWT ' + token});
    } else {
    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
    }
    });
    }
    });
   });


   //Create a router for logout.
   router.post('/logout', passport.authenticate('jwt', { session: false}), function(req, res) {
    req.logout();
    res.json({success: true});
   });
   
   //export router as a module.
   module.exports = router;

