'use strict';
var async = require('async');
var debug = require('debug')('ccpairing:populateDb');
var mongoose = require('mongoose');
var path = require('path');
var db = require(path.join('./../lib/connections'));
var Users = mongoose.model('Users');
var Pairs = mongoose.model('Pairs');

var data = {
    users : [
        {
            username    : 'admin',
            password    : 'admin',
            role        : 'admin',
            plant       : 'manager',
            screen      : 'pairing'
        },
        {
            username    : 'user1',
            password    : 'user1',
            role        : 'regular',
            plant       : 'corporate'
        }
    ]
};

var deleteUsers =  function(callback) {
    console.log('Deleting Users');
    Users.remove({}, function(error, response){
        if (error){
            console.error('Error deleting Users ' + error);
        }
        console.info('Done deleting Users');
        callback(null, 'Done deleting Users');
    });
};

var addUsers =  function(callback) {
    console.log('Adding Users');
    Users.create(data.users, function(error, response){
        if (error){
            console.error('Error adding Users ' + error);
        }
        console.info('Done adding Users');
        callback(null, 'Done adding Users');
    });
};
var deletePairs =  function(callback) {
    console.log('Deleting Pairs');
    Pairs.remove({}, function(error, response){
        if (error){
            console.error('Error deleting Pairs ' + error);
        }
        console.info('Done deleting pairs');
        callback(null, 'Done deleting pairs');
    });
};
/*
var addPairs =  function(callback) {
    console.log('Adding Pairs');
    Pairs.create(data.pairs, function(error, response){
        if (error){
            console.error('Error adding Pairs ' + error);
        }
        console.info('Done adding Pairs');
        callback(null, 'Done adding Pairs');
    });
};
*/

var cleanAndPopulateDb = function() {
    debug("inside cleanAndPopulateDb");
    async.series([deleteUsers, deletePairs, addUsers], function(error, results){
        console.log(results);
        if (error){
                console.error('Error ' + error);
        }
        mongoose.connection.close();
        console.log('All done');
        for (var i in results) {
            debug(results[i]);
        }
    });
};
cleanAndPopulateDb();
//setImmediate(cleanAndPopulateDb);
//setTimeout(cleanAndPopulateDb,10000);
