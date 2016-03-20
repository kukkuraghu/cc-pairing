'use strict';
var debug = require('debug')('example-server');
var net = require('net');
var q = require('q');
exports.pageBeeper = pageBeeper;
var HOST = process.env.transmitter_ip || '192.168.1.37';
var PORT = process.env.transmitter_port || 30090;
var capCode = process.env.transmitter_capCode || '039';
debug('transmitter host : ' + HOST);
debug('transmitter port : ' + PORT);
debug('transmitter capcode : ' + capCode);

function pageBeeper(pagerID) {
    console.log('i am in pageBeeper in paging.js');
    var deferred = q.defer();
    var client = new net.Socket();
    client.connect(PORT, HOST);
    client.on('connect', sendData);
    client.on('error', processError);
    return deferred.promise;
    function sendData(){
        console.log('pager ID in sendData : ' + pagerID);
        var byteArray = new Uint8Array(13);

        //Load the preamble
        byteArray[0]    = 0xFF;
        byteArray[1]    = 0xFF;
        byteArray[2]    = 0xFF;

        //Setting function bit - Priority Alert for Numeric Only Pagers 
        byteArray[3]    = 0x01;

        //Setting capcode and pager ID
        byteArray[4]    = capCode.charCodeAt(0);
        byteArray[5]    = capCode.charCodeAt(1);
        byteArray[6]    = capCode.charCodeAt(2);
        byteArray[7]    = pagerID.charCodeAt(0);
        byteArray[8]    = pagerID.charCodeAt(1);
        byteArray[9]    = pagerID.charCodeAt(2);
        byteArray[10]   = pagerID.charCodeAt(3);

        //Adding separator
        byteArray[11]    = 0x03;

        //Adding terminator
        byteArray[12]    = 0x0D;
        var buffer = new Buffer(byteArray); 
        console.log(buffer);
        sendAndCloseConnection(buffer);
    }
    
    function processError(error) {
        console.log('error in paging.js :' + error);
        client.destroy();
        //return deferred.resolve({status : 1, message : 'page successful'}); 
        return deferred.reject(error);
    }
    function sendAndCloseConnection(data) {
        console.log('inside sendAndCloseConnection data :' );
        console.log(data);
        if (data) {
            client.write(data, function(data){ 
                console.log(data);
                client.destroy(); 
                return deferred.resolve({status : 1, message : 'page successful'});
            });
        } 
        else {
          client.destroy();  
          return deferred.resolve();
        }  
    }
}
