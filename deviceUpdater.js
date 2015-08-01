"use strict";
var ipc = require('ipc');
var adb = require('./adb');

var prevDeviceOutput = "";

function updateDevice(event) {
    adb.getDevices().then(function (devices) {
        event.sender.send("getDevices-reply", devices);
    });
}

exports.updateInterval = function (event) {
    adb.getAdbDeviceOutput().then(function (adbDeviceOutput) {
        adbDeviceOutput = adbDeviceOutput.toString();
        if (adbDeviceOutput != prevDeviceOutput) {
            updateDevice(event);
        }
        prevDeviceOutput = adbDeviceOutput;

        setTimeout(function () {
            exports.updateInterval(event);
        }, 1000);
    });
};

