'use strict';
var debug = require('debug')('example-server');
var mongoose = require('mongoose');
var CurrentCC = mongoose.model('CurrentCC');
exports.updateCurrentCC = updateCurrentCC;


//updates the current crank case
//if the callback function is provided, calls that
//else returns a promise
function updateCurrentCC(currentCC, callback) {
    debug('lib adminServices.js updateCurrentCC -  currentCC :' +  currentCC);
        if (callback && (typeof callback === 'function')) {
            CurrentCC.create({currentCC : currentCC}, callback);
        }
        else {
            return CurrentCC.create({currentCC : currentCC});
        }
}

