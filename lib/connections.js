var mongoose = require('mongoose'); 
//var dbUrl = 'mongodb://your_mongo_connection_url';
 //mongodb://localhost:27017/mongoose-bcrypt-test
 var dbUrl = 'mongodb://localhost:27017/recrankcasedb';
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