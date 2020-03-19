
//required modules of the Mongoose model, Passport.js, JWT, Express Router, and Configuration file
var passport = require('passport');
var config = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Category = require("../models/category");

//Add a route to get the list of the category.
router.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
    Category.find(function (err, categories) {
    if (err) return next(err);
    res.json(categories);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });
   
   //Add a route to get a single category by ID.
   router.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Category.findById(req.params.id, function (err, category) {
    if (err) return next(err);
    res.json(category);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a route to post a category.
   router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Category.create(req.body, function (err, category) {
    if (err) return next(err);
    res.json(category);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a route to put a category by ID.
   router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
    if (err) return next(err);
    res.json(category);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a route to delete a category by ID.

   router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Category.findByIdAndRemove(req.params.id, req.body, function (err, category) {
    if (err) return next(err);
    res.json(category);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a function to get and extract the token from the request headers.
   getToken = function (headers) {
    if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
    return parted[1];
    } else {
    return null;
    }
    } else {
    return null;
    }
   };

//export router as a module
   module.exports = router;

   

