/**
 * Created by ccheng on 7/30/15.
 */
"use strict";
var ipc = require('ipc');
var adb = require('./adb');
var fs = require('fs');
var path = require('path');

var TMP_PATH = 'tmp';

function Operation() {

}

Operation.prototype.register = function () {
    ipc.on('getDevices', function (event) {
        adb.getDevices().then(function (devices) {
            event.sender.send("getDevices-reply", devices);
        })
    })

    ipc.on('installApk', function (event, fileName, fileContent) {
        fs.open(path.join(TMP_PATH, fileName), 'w', function (err, fd) {
            if (err) {
                return console.log('err:' + err);
            }

            fs.write(fd, fileContent, function (err) {
                if (err) {
                    return console.log("err = " + err);
                }
            })
        })
    })
}

module.exports = Operation;