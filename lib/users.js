'use strict';
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;

function getUser(username, callback) {
    Users.findOne({username : username}).exec(callback);
}

function getUsers() {
}

function addUser() {
}

function updateUser() {
}