var debug = require('debug')('ccpairing:connections');
var mongoose = require('mongoose'); 
var config = require( './../config' );
var dbIP = process.env.db_ip;
var dbPort = process.env.db_port;
var dbName = process.env.db_name;
dbIP = dbIP || 'localhost';
dbPort = dbPort || '27017';
dbName = dbName || 'recrankcasedb';
var conf = {};
conf.dbTimeout = 30000;
var dbUrl = 'mongodb://' + dbIP + ':' + dbPort + '/' + dbName;
debug('dbUrl : ' + dbUrl);
// Database connect options
var options = { replset: { socketOptions: { connectTimeoutMS : conf.dbTimeout }}};
mongoose.connect(config.mongoURI, options);
mongoose.connection.on('connected', function () {console.log('MongoDB connected')}); 
mongoose.connection.on('error',     function()  {console.log('MongoDB connection error')});
mongoose.connection.on('close',     function()  {console.log('MongoDB connection closed')});
// Close the Mongoose connection on Control+C 
process.on('SIGINT', function() {  
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected');    
        process.exit(0);  
    }); 
});
require('../models/users'); 
require('../models/pairs');
require('../models/currentCC');