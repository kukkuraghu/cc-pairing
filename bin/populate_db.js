'use strict';
var async = require('async');
var debug = require('debug')('example-server');
var mongoose = require('mongoose');
var path = require('path');
var db = require(path.join(process.cwd() + '/../lib/') + 'connections');
//require('../models/users'); 
//require('../models/pairs');
var Users = mongoose.model('Users');
var Pairs = mongoose.model('Pairs');

var data = {
    users : [
        {
            username    : 'john',
            password    : 'test',
            role        : 'regular',
            plant       : 'workshop'
        },
        {
            username    : 'raju',
            password    : 'test1',
            role        : 'admin',
            plant       : 'corporate'
        },
        {
            username    : 'arun',
            password    : 'test2',
            role        : 'regular',
            plant       : 'workshop'
        }        
    ],
    pairs : [
        {
            crankCase   : '10001',
            beeper      : '1001'
        },
        {
            crankCase   : '10002',
            beeper      : '1002'
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
}
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


async.series([deleteUsers, deletePairs, addUsers, addPairs], function(error, results){
    if (error){
            console.error('Error ' + error);
    }
    mongoose.connection.close();
    console.log('All done');
    for (var i in results) {
        debug(results[i]);
    }
});