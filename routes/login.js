'use strict'
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
var usersServices = require('../lib/users');
var router = express.Router();

router.post('/login', function(req, res, next) { 
    debug('express POST request route login ');
    debug('username received : ' + req.body.username);
    debug('password received : ' + req.body.password);
    var getUserPromise = usersServices.getUser(req.body.username);
    getUserPromise.then(usersServicesSuccess, usersServicesFailure);
    function usersServicesSuccess(data) {
        var response = {status : 0, message :'Authorization Failed'};
        if (data && data.password === req.body.password) {
            response.status = 1;
            response.message = 'Authorization Successful';
            response.data = data;
        }
        else {
            response.status = 0;
            response.message = 'Authorization failed';
        }
        return res.status(200).json(response);
    }
    function usersServicesFailure(data) {
        next('login error');
    }
});

router.post('/cp', function(req, res, next) { 
    debug('express POST request route cp ');
    debug('username received : ' + req.body.username);
    debug('current password : ' + req.body.cp);
    debug('new password : ' + req.body.np);
    var getUserPromise = usersServices.getUser(req.body.username);
    getUserPromise.then(getUserSuccess, getUserFailure);
    function getUserSuccess(data) {
        debug('route cp getUserSuccess');
        var response = {status : 0, message :'Authorization Failed'};
        if (!data) {
            response.status = 0;
            response.message = 'User does not exist';
            return res.status(200).json(response);
        }
        if (data && data.password !== req.body.cp) {
            debug('route cp getUserSuccess database password : ' + data.password);
            response.status = 0;
            response.message = 'Current Password is not matching';
            response.data = data;
            return res.status(200).json(response);
        }
        if (data && data.password === req.body.cp) {
            debug('password is matching');
            var updatePasswordPromise = usersServices.changePassword(data.username, req.body.np);
            updatePasswordPromise.then(updatePasswordSuccess, updatePasswordFailure);
        }
        else {
            response.status = 0;
            response.message = '';
        }
    }
    function getUserFailure(data) {
        next('login error');
    }
    function updatePasswordSuccess(data) {
        var response = {status : 1, message :'Password changed successfully'};
        return res.status(200).json(response);
    }
    function updatePasswordFailure(data) {
        next('Password change failed');
    }

});

router.post('/add_user', function(req, res, next) { 
    debug('express POST request route add_user');
    debug('username : ' + req.body.username);
    debug('password : ' + req.body.password);
    debug('plant : ' + req.body.plant);
    debug('role : ' + req.body.role);
    debug('screen : ' + req.body.screen);
    var getUserPromise = usersServices.getUser(req.body.username);
    getUserPromise.then(getUserSuccess, getUserFailure);
    function getUserSuccess(data) {
        debug('route add_user getUserSuccess');
        var response = {status : 0, message :''};
        if (data) {
            response.status = 0;
            response.message = 'User already exists';
            return res.status(200).json(response);
        }
        else {
            var addUserPromise = usersServices.addUser(req.body.username, req.body.password, req.body.plant, req.body.role, req.body.screen);
            addUserPromise.then(addUserSuccess, addUserFailure);
        }
    }
    function getUserFailure(data) {
        next('Database error');
    }
    function addUserSuccess(data) {
        var response = {status : 1, message :'User added successfully'};
        return res.status(200).json(response);
    }
    function addUserFailure(data) {
        next('Add user failed');
    }

});

router.post('/get_user', function(req, res, next) { 
    debug('express POST request route get_user ');
    debug('username received : ' + req.body.username);
    var getUserPromise = usersServices.getUser(req.body.username);
    getUserPromise.then(usersServicesSuccess, usersServicesFailure);
    function usersServicesSuccess(data) {
        var response = {status : 0, message :'User not found'};
        if (data) {
            response.status = 1;
            response.message = 'User found';
            response.data = data;
        }
        return res.status(200).json(response);
    }
    function usersServicesFailure(data) {
        next('login error');
    }
});

router.post('/modify_user', function(req, res, next) { 
    debug('express POST request route update_user ');
    debug('username : ' + req.body.username);
    debug('password : ' + req.body.password);
    debug('plant : ' + req.body.plant);
    debug('role : ' + req.body.role);
    debug('screen : ' + req.body.screen);
    var getUserPromise = usersServices.getUser(req.body.username);
    getUserPromise.then(getUserSuccess, getUserFailure);
    function getUserSuccess(data) {
        debug('route update_user getUserSuccess');
        var response = {status : 0, message :''};
        if (!data) {
            response.status = 0;
            response.message = 'User does not exist';
            return res.status(200).json(response);
        }
        else {
            var modifyUserPromise = usersServices.modifyUser(req.body.username, req.body.password, req.body.plant, req.body.role, req.body.screen);
            modifyUserPromise.then(modifyUserSuccess, modifyUserFailure);
        }
    }
    function getUserFailure(data) {
        next('Database error');
    }
    function modifyUserSuccess(data) {
        var response = {status : 1, message :'User data updated'};
        return res.status(200).json(response);
    }
    function modifyUserFailure(data) {
        next('Delete user failed');
    }

});

router.post('/delete_user', function(req, res, next) { 
    debug('express POST request route delete_user ');
    var getUserPromise = usersServices.getUser(req.body.username);
    getUserPromise.then(getUserSuccess, getUserFailure);
    function getUserSuccess(data) {
        debug('route update_usdelete_userer getUserSuccess');
        var response = {status : 0, message :''};
        if (!data) {
            response.status = 0;
            response.message = 'User does not exist';
            return res.status(200).json(response);
        }
        else {
            var deleteUserPromise = usersServices.deleteUser(req.body.username);
            deleteUserPromise.then(deleteUserSuccess, deleteUserFailure);
        }
    }
    function getUserFailure(data) {
        next('Database error');
    }
    function deleteUserSuccess(data) {
        var response = {status : 1, message :'User deleted'};
        return res.status(200).json(response);
    }
    function deleteUserFailure(data) {
        next('Delete user failed');
    }

});

router.get('/get_users', function(req, res, next) { 
    debug('express GET request route get_users');
    var getUsersPromise = usersServices.getUsers();
    getUsersPromise.then(successHandler, errorHandler);
    function successHandler(result) {
        debug('route  get_users successHandler');
        debug(result);
        var response = {};
        response.status = 1;
        response.message = 'list of users';
        response.data = result;
        return res.status(200).json(response);
    }
    function errorHandler(error) {
        debug('error in getting users');
        debug(error); 
        return next(error);
    }
});

module.exports = router;
