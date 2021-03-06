'use strict';
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
//var Employee = mongoose.model('Employee'); 
//var Pairs = mongoose.model('Pairs'); 
var pairServices = require('../lib/pairs');
var router = express.Router();

router.post('/pair', function(req, res, next) { 
    debug('express POST request route pair ' + 'crankCase :' + req.body.crankCase + ' beeperId :' + req.body.beeper + ' paired by : ' + req.body.user);
    var pairCreationPromise = pairServices.addPair(req.body.crankCase, req.body.beeper, req.body.user);
    pairCreationPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully inserted pair ' + 'crank case :' + result.crankCase + ' beeper : ' + result.beeper );
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'CC ' + result.crankCase + ' is paired with the buzzer ' + result.beeper;
        response.data = result;
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in saving pair');
        debug(error); 
        if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate crank case or beeper
            debug('duplicate entry');
            var response = {};
            response.status = 0;
            response.message = 'Either crankcase or buzzer already paired';

            var getBeeperPromise = pairServices.getMatchingBeeper(req.body.crankCase);
            getBeeperPromise.then(beeperSuccess, beeperFailure);
            function beeperSuccess(data) {
                debug('router pair, function beeperSuccess, data : ' + data);
                if (data) {
                    response.message = 'Crank case ' + data.crankCase +' already paired with beeper ' + data.beeper;
                    response.data = data;
                    return res.status(200).json(response);
                }
                else {
                    var getCCPromise = pairServices.getMatchingCC(req.body.beeper);
                    getCCPromise.then(CCSuccess, CCFailure);
                    function CCSuccess(data) {
                        debug('router pair, function CCSuccess, data : ' + data);
                        if (data) {
                            response.message = 'Crank case ' + data.crankCase +' already paired with beeper ' + data.beeper;
                            response.data = data;
                        }
                        else {
                            response.message = 'Severe Error. Contact Admin';
                        }
                        return res.status(200).json(response);
                    }
                    function CCFailure(error) {
                        debug('route pair  function CCFailure error : ' + error);
                        res.sendStatus(500);
                    }
                }
            }
            function beeperFailure(error) {
                debug('route pair beeperFailure error : ' + error);
                return next(error);
            }

            //debug(response);
            //return res.status(200).json(response);
            //return res.status(500).send({ succes: false, message: 'record already exist!' });
        }
        else {
            return next(error);
        }
    }
});

router.post('/unpair', function(req, res, next) { 
    debug('express POST request route unpair ' + 'crankCase :' + req.body.crankCase + ' beeperId :' + req.body.beeper);
    var getBeeperPromise = pairServices.getMatchingBeeper(req.body.crankCase);
    getBeeperPromise.then(beeperSuccess, beeperFailure);
    function beeperSuccess(data) {
        var response = {};
        debug('router unpair, function beeperSuccess, data : ' + data);
        if (data) {
            if (data.beeper === req.body.beeper) {
                debug('router unpair, function beeperSuccess, beeper matches with crankcase')
                unpair();    
            }
            else {
                debug('router unpair, function beeperSuccess, beeper does not match with crankcase')
                response.status = 0;
                response.message = 'Matching pair not found';
                return res.status(200).json(response);
            }
        }
        else {
            response.status = 0;
            response.message = 'Matching pair not found';
            return res.status(200).json(response);
        }
    }
    function beeperFailure(error) {
        debug('route unpair beeperFailure error : ' + error);
        res.sendStatus(500);
    }
    function unpair() {
        var unpairPromise = pairServices.unpair(req.body.crankCase, req.body.beeper);
        unpairPromise.then(successHandler, errorHandler);
        function successHandler(result) {
            debug('successfully unpaired');
            //debug(result);
            var response = {};
            response.status = 1;
            response.message = 'CC ' + req.body.crankCase + ' unpaired from the buzzer ' + req.body.beeper;
            response.data = JSON.parse(JSON.stringify(result));
            debug(response.data);
            return res.status(200).json(response);
        }
        function errorHandler(error) {
            debug('error in unpairing');
            debug(error); 
            var response = {};
            response.status = 0;
            response.message = 'Unpairing unsuccessful';
            response.data = error;
            debug(response);
            return res.status(200).json(response);
        }    
    }


    
});

router.post('/unpairall', function(req, res, next) { 
    debug('express POST request route unpairall ');
    var unpairAllPromise = pairServices.unpairall();
    unpairAllPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('successfully unpaired');
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'All pairs removed';
        response.data = JSON.parse(JSON.stringify(result));
        debug(response.data);
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in unpairing');
        debug(error); 
        var response = {};
        response.status = 0;
        response.message = 'Unpairing unsuccessful';
        response.data = error;
        debug(response);
        return res.status(200).json(response);
    }
});

router.post('/get_crankcase/:pager', function(req, res, next) { 
    debug('express POST request route pairs get_crankcase ' + 'pager : ' + req.params.pager);
    //pairServices.getMatchingCC ? debug('getMatchingBeeper defined') : debug('getMatchingBeeper not defined');
    var getCCPromise = pairServices.getMatchingCC(req.params.pager);
    getCCPromise.then(CCSuccess, CCFailure);
    function CCSuccess(data) {
        var response = {};
        debug('router get_crankcase, function CCSuccess, data : ' + data);
        if (data) {
            response.status = 1;
            response.message = 'Matching crankcase found';
            response.data = data;
        }
        else {
            response.status = 0;
            response.message = 'Matching crankcase not found';
        }
        return res.status(200).json(response);
    }
    function CCFailure(error) {
        debug('route page get_crankcase error : ' + error);
        res.sendStatus(500);
    }
});
router.get('/get_pairs', function(req, res, next) { 
    debug('express GET request route get_pairs');
    var getPairsPromise = pairServices.getPairs();
    getPairsPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('route  get_pairs successHandler');
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'list of pairs';
        response.data = result;
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in getting pairs');
        debug(error); 
        return next(error);
    }
});

router.post('/get_pager/:crankCase', function(req, res, next) { 
    debug('express POST request route pair get_pager ' + 'crankCase : ' + req.params.crankCase);
    var getBeeperPromise = pairServices.getMatchingBeeper(req.params.crankCase);
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

//function returns trimmed crank case (cc) label. 
//cc will be trimmed to a length mentioned in the environment variable CC-LENGTH
//If no CC-LENGTH is set, the function will return cc as it is.
function trimCrankCase(cc) {
    return cc;
}
module.exports = router;
