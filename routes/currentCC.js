'use strict';
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
//var Employee = mongoose.model('Employee'); 
//var Pairs = mongoose.model('Pairs'); 
var adminServices = require('../lib/adminServices');
var router = express.Router();

router.post('/currentCC', function(req, res, next) { 
    debug('express POST request route currentCC ' + 'crankCase :' + req.body.crankCase);
    debug(req);
    var updateCurrentCCPromise = adminServices.updateCurrentCC(req.body.crankCase);
    updateCurrentCCPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully updated current CC ' + 'current crank case :' + result.currentCC);
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'Successfully updated current CC';
        response.data = result;
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in updating current CC');
        debug(error); 
        return res.status(500).send({ success: false, message: 'error in updating current CC : ' + req.body.crankCase});
    }
});

module.exports = router;
