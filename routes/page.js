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
});

router.post('/get_pager/:crankCase', function(req, res, next) { 
    debug('express POST request route page get_pager ' + 'crankCase : ' + req.params.crankCase);
    pageServices.getMatchingBeeper ? debug('getMatchingBeeper defined') : debug('getMatchingBeeper not defined');
    var getBeeperPromise = pageServices.getMatchingBeeper(req.params.crankCase);
    getBeeperPromise.then(beeperSuccess, beeperFailure);
    function beeperSuccess(data) {
        var response = {};
        debug('router get_pager, function beeperSuccess, data : ' + data);
        if (data) {
            response.status = 1;
            response.message = 'Matching pager found';
            response.data = data;
        }
        else {
            response.status = 0;
            response.message = 'Matching pager not found';
        }
        debug('router get_pager, before sending the response');
        return res.status(200).json(response);
    }
    function beeperFailure(error) {
        debug('route page get_pager error : ' + error);
        res.sendStatus(500);
    }
});
module.exports = router;
