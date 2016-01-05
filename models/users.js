'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UsersSchema = new Schema({
    username    : {type : String, required : true},
    password    : {type : String, required : true},
    role        : String,
    plant       : String,
    screen      : String
});
module.exports = mongoose.model('Users', UsersSchema);