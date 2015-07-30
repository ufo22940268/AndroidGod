/**
 * Created by ccheng on 7/30/15.
 */
"use strict";
var ipc = require('ipc');
var adb = require('./adb');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
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
        fs.openAsync(path.join(TMP_PATH, fileName), 'w')
            .then(function (fd) {
                return fs.writeAsync(fd, fileContent);
            }).then(function () {
                console.log("Write finished");
            }).catch(function (err) {
                console.log("err:" + err);
            })
    })
}

module.exports = Operation;