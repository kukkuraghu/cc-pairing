'use strict';
var debug = require('debug')('example-server');
var mongoose = require('mongoose');
var q = require('q');
var async = require('async');
console.log(process.cwd());
var page = require('./paging').pageBeeper;
var Pairs = mongoose.model('Pairs');
exports.getMatchingCC = getMatchingCC;
exports.getMatchingBeeper = getMatchingBeeper;
exports.getPairs = getPairs;
exports.addPair = addPair;
exports.updatePair = updatePair;
exports.pageBeeper = pageBeeper;

function getMatchingCC() {

}
function getMatchingBeeper(crankCase) {
    debug('lib pairs.js getMatchingBeeper crankCase : ' + crankCase);
    var query = Pairs.findOne({crankCase : crankCase});
    return query.exec();
}

function getPairs() {
}

function addPair(crankCase, beeper) {
    return Pairs.create({crankCase : crankCase, beeper : beeper});
}

function updatePair() {
}

function pageBeeper(crankCase) {
    console.log('i am in pageBeeper in lib/pairs.js');
    console.log('crankCase in pageBeeper in lib/pairs.js :' + crankCase);
    var deferred = q.defer();
    async.waterfall([getBeeper, pageBeep], function(error, result){
        debug('in page route error :' + error);
        debug('in page route result : ' + result);
        (error) ? deferred.reject(error) : deferred.resolve(result);
    });
    return deferred.promise;
    function getBeeper(callback) {
        var getBeeperPromise = getMatchingBeeper(crankCase);
        getBeeperPromise.then(beeperSuccess, beeperFailure);
        function beeperSuccess(data) {
            debug('lib pairs, function beeperSuccess, data : ' + data);
            data ? callback(null,data.beeper) : callback('No beeper in the database');
        }
        function beeperFailure(error) {
            debug('route page, function beeperFailure, error : ' + error);
            callback(error);
        }
    }
    function pageBeep(beeperID, callback) {
        debug('lib pairs.js pageBeeper pageBeep beeper ID : ' + beeperID);
        var pageStatus = page(beeperID);
        pageStatus.then(pageSucess, pageError);
        function pageSucess(data){
            console.log(data);
            callback(null, data);
            //res.sendStatus(200);
        }
        function pageError(error){
            console.log(error);
            callback(error);
            //res.sendStatus(200);
        }
    }
    //var beeperPromise = getMatchingBeeper(crankCase);
    //beeperPromise.then()
    //return page(crankCase);
}