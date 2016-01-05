'use strict';
var debug = require('debug')('example-server');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.modifyUser = modifyUser;
exports.changePassword = changePassword;

//Looks for the user in the databse
//if the callback function is provided, calls that
//else returns a promise
function getUser(username, callback) {
    debug('lib users.js getUser username :' +  username);
        if (typeof callback === 'function') {
            Users.findOne({username : username}).exec(callback);
        }
        else {
            return Users.findOne({username : username}).exec();
        }
}

function getUsers() {
}

function addUser(username, password, plant, role, screen) {
    return Users.create({username : username, password : password, plant : plant, role : role, screen : screen});
}

function modifyUser(username, password, plant, role, screen) {
    return Users.update({username : username}, {password : password, plant : plant, role : role, screen : screen}).exec();
}
function changePassword(username, np) {
    debug('lib users.js changePassword username :' +  username + ' np : ' + np);
    return Users.update({username : username}, {password : np}).exec();
}