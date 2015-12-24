var debug = require('debug')('example-server');
var mongoose = require('mongoose'); 
var dbIP = process.env.db_ip;
var dbPort = process.env.db_port;
var dbName = process.env.db_name;
var dbUrl = 'mongodb://' + dbIP + ':' + dbPort + '/' + dbName;
debug('dbUrl : ' + dbUrl);
mongoose.connect(dbUrl, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});
// Close the Mongoose connection on Control+C 
process.on('SIGINT', function() {  
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected');    
        process.exit(0);  
    }); 
});
require('../models/users'); 
require('../models/pairs');