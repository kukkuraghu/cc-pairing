'use strict'
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
var async = require('async');
//var Employee = mongoose.model('Employee'); 
//var Team = mongoose.model('Team'); 
var pageServices = require('../lib/pairs');
var router = express.Router();

router.post('/page', function(req, res, next) { 
    debug('express POST request route page ' + 'crankCase : ' + req.body.crankCase);
    var beepPromise = pageServices.pageBeeper(req.body.crankCase);
    beepPromise.then(beeperSuccess, beeperFailure)
    //beepPromise.then(function(result){debug(result); res.sendStatus(200);}, function(error) {debug(error);res.sendStatus(500);} )
    function beeperSuccess(data) {
        var response = {};
        debug('router /page/:crankCase, function beeperSuccess, data : ' + data);
        if (data) {
            response.status = 1;
            response.message = 'Paged Successfully';
            response.data = data;
        }
        else {
            response.status = 0;
            response.message = 'Matching pager not found';
        }
        debug('/page/:crankCase, before sending the response');
        return res.status(200).json(response);
    }
    function beeperFailure(error) {
        debug('route page beeperFailure error : ' + error);
        //debug('route page beeperFailure data : ' + data);
        var response = {};
        error.status = 0;
        debug(error);
        res.status(200).json(error);
    }
});

module.exports = router;
