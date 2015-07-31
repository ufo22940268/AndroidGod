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

    ipc.on('installApk', function (event, device, apkFile) {
        adb.install(device, apkFile)
            .then(function () {
                return adb.aaptParseInfo(apkFile)
            })
            .then(function (info) {
                return adb.launchApp(device, info.package, info.activity)
            })
            .then(function (stdout) {
                event.sender.send("installApk-reply", {});
            })
            .catch(function (err) {
                if (err) {
                    event.sender.send("installApk-reply", { err: err });
                }
            });
    })
}

module.exports = Operation;