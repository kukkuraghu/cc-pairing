'use strict'
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
var usersServices = require('../lib/users');
//var Users = mongoose.model('Users'); 
//var Team = mongoose.model('Team'); 
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
module.exports = router;
