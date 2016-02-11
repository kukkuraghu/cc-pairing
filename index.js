'use strict';
var express = require('express'); 
var debug = require('debug')('example-server');
var path = require('path'); 
var favicon = require('serve-favicon'); 
var logger = require('morgan'); 
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser');
require('./lib/connections'); 
var pair = require('./routes/pair'); 
var page = require('./routes/page');
var login = require('./routes/login');
var currentCC = require('./routes/currentCC');
var app = express();
// app.use(favicon(__dirname + '/public/favicon.ico')); 
app.use(logger('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser()); 
/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});
*/
app.use(express.static(path.join(__dirname, 'public')));
// application routes 
app.use(login);
app.use(pair); 
app.use(page);
app.use(currentCC);
// catch 404 and forward to error handler 
app.use(function(req, res, next) {  var err = new Error('Not Found');
    err.status = 404;  
    next(err);
}); 

// error handlers
// development error handler // will print stacktrace 
if (app.get('env') === 'development') {  
    app.use(function(err, req, res, next) {    
        debug('in express error handler development');
        res.status(err.status || 500);    
        res.send({ message: err.message,      error: err    });
    }); 
}
// production error handler // no stacktraces leaked to user 
app.use(function(err, req, res, next) {  
    debug('in express error handler production');
    res.status(err.status || 500); 
});
module.exports = app;