//required modules of the Mongoose model, Passport.js, JWT, Express Router, and Configuration file.
var passport = require('passport');
var config = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Post = require("../models/category");

//Add a route to GET the list of posts.
router.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
    Post.find(function (err, posts) {
    if (err) return next(err);
    res.json(posts);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });
   
   //Add a route to GET a single post data by ID.

   router.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Post.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a route to POST a post data.

   router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Post.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a router to PUT a post data by ID.

   router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
    });
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
   });

   //Add a router to DELETE a post data by ID.
   router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
    Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
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
   
   //export the router a module.
   module.exports = router;
