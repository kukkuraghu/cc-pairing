'use strict'
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
var async = require('async');
//var Employee = mongoose.model('Employee'); 
//var Team = mongoose.model('Team'); 
var pageServices = require('../lib/pairs');
var router = express.Router();

router.post('/page/:crankCase', function(req, res, next) { 
    debug('express POST request route page ' + 'crankCase : ' + req.params.crankCase);
    var beepPromise = pageServices.pageBeeper(req.params.crankCase);
    beepPromise.then(function(result){debug(result); res.sendStatus(200);}, function(error) {debug(error);res.sendStatus(500);} )

    
    //res.sendStatus(200);
    /*
    Employee.find().sort('name.last').exec(function(error, results) {  
            if (error) {      return next(error);  }
            res.json(results);  
        }); 
    */
});
module.exports = router;
