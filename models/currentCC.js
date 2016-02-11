'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var currentCCSchema = new Schema({
    currentCC   : {type : String, required : true, unique : true, index : true}
});
module.exports = mongoose.model('CurrentCC', currentCCSchema);