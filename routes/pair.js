'use strict';
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
//var Employee = mongoose.model('Employee'); 
//var Pairs = mongoose.model('Pairs'); 
var pairServices = require('../lib/pairs');
var router = express.Router();

router.post('/pair', function(req, res, next) { 
    debug('express POST request route pair ' + 'crankCase :' + req.body.crankCase + ' beeperId :' + req.body.beeper);
    var pairCreationPromise = pairServices.addPair(req.body.crankCase, req.body.beeper);
    pairCreationPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully inserted pair ' + 'crank case :' + result.crankCase + ' beeper : ' + result.beeper );
        debug(result);
        return res.sendStatus(200)
    }
    function errorHandler(error) {
        debug('error in saving pair');
        debug(error); 
        if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate crank case or beeper
            debug('duplicate entry');
            return res.status(500).send({ succes: false, message: 'record already exist!' });
        }
        return next(error);
    }
});
module.exports = router;
