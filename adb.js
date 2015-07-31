/**
 * Created by cc on 7/25/15.
 */
"use strict";

var Promise = require('bluebird');
var childProcess = Promise.promisifyAll(require('child_process'));
var Device = require('./device');

var ADB_PATH = "tools/adb"

module.exports = {

    parseDevice: function (line) {
        return new Device(/([\w|\.|:]+)/.exec(line)[1]);
    },

    getDevices: function () {
        var self = this;
        return new Promise(function (fullfill, reject) {
            childProcess.exec(ADB_PATH + ' devices', function (err, stdout, stderr) {
                if (err) {
                    reject(stderr);
                } else {
                    fullfill(stdout);
                }
            })
        }).then(function (stdout) {
                var lines = stdout.split('\n').filter(function (line) {
                    return /\w+/.test(line);
                });
                return Promise.resolve(lines.slice(1)).map(self.parseDevice);
            }
        )
    },

    buildInstallCmd: function (device, apkFile) {
        return ADB_PATH + " -s " + device.name + " install -r " + apkFile;
    },

    install: function (device, apkFile) {
        var buildInstallCmd = this.buildInstallCmd(device, apkFile);
        console.log("buildInstallCmd = " + buildInstallCmd)
        return childProcess.execAsync(buildInstallCmd)
            .then(function (stdout, stderr) {
                if (stderr) {
                    throw stderr;
                }
                return stdout;
            })
    },

    isApkFile: function (fileName) {
        return fileName.match(/\.apk$/);
    }
}
