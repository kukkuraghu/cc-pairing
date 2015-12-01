'use strict'
var express = require('express'); 
var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
var usersService = require('../lib/users');
//var Users = mongoose.model('Users'); 
//var Team = mongoose.model('Team'); 
var router = express.Router();

router.post('/login', function(req, res, next) { 
    debug('express POST request route login ');
    console.log('username received : ' + req.body.username);
    console.log('password received : ' + req.body.password);
    usersService.getUser(req.body.username, function(error, data) {
        var response = {status : 0, message :'Authorization Failed'};
        if(error) {
            console.log('error in getting user');
            console.log(error);
            return next(error);
        }
        console.log('no error in getting user');
        console.log(data);
        response.status = 1;
        response.message = 'Authorization Successful';
        response.data = data;
        return res.status(200).json(response);
    });
    //setTimeout(function() {res.sendStatus(200);}, 5000);
    /*
    Employee.find().sort('name.last').exec(function(error, results) {  
            if (error) {      return next(error);  }
            res.json(results);  
        }); 
    */
});
module.exports = router;
