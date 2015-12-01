'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PairsSchema = new Schema({
    crankCase   : {type : String, required : true, unique : true, index : true},
    beeper      : {type : String, required : true, unique : true, index : true}
});
module.exports = mongoose.model('Pairs', PairsSchema);