/**
 * Created by cc on 7/25/15.
 */
"use strict";

var Promise = require('bluebird');
var childProcess = Promise.promisifyAll(require('child_process'));
var Device = require('./device');
var path = require('path');

var ADB_PATH = path.join(__dirname, "tools/adb");
var AAPT_PATH = path.join(__dirname, "tools/aapt");


function AdbCmd(device) {
    this.cmdPre = ADB_PATH + " -s " + device.name + " ";
}

AdbCmd.prototype.exec = function (cmd) {
    console.log("cmd = " + this.cmdPre + cmd)
    return childProcess.execAsync(this.cmdPre + cmd);
}

module.exports = {

    parseDevice: function (line) {
        return new Device(/([\w|\.|:]+)/.exec(line)[1]);
    },

    getAdbDeviceOutput: function () {
        return childProcess.execAsync('adb devices');
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
            }).map(function (device) {
                return self.getProductModel(device)
                    .then(function (model) {
                        device.model = model;
                        return device;
                    });
            })
    },

    getProductModel: function (device) {
        return new AdbCmd(device).exec('shell getprop ro.product.model')
            .then(function (stdout) {
                stdout = stdout.toString();
                if (stdout.indexOf('-') != -1) {
                    console.log("in")
                    stdout = stdout.toString().match(/(.*?)-/)[1]
                }
                stdout = stdout.replace(',', '');
                return stdout.toString().trim();
            })
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


    launchApp: function (device, pkg, activity) {
        var cmd = ADB_PATH + " -s " + device.name + " shell am start " + pkg + "/" + activity;
        return childProcess.execAsync(cmd);
    },

    isApkFile: function (fileName) {
        return fileName.match(/\.apk$/);
    },

    aaptParseInfo: function (apk) {
        return childProcess.execAsync(AAPT_PATH + ' dump --values xmltree ' + apk + ' AndroidManifest.xml')
            .then(function (stdout, stderr) {
                if (stderr) {
                    throw new Error(stderr);
                }

                //console.log("stdout  = " + stdout)
                var info = {}
                try {
                    info.package = /package="(.+?)"/.exec(stdout)[1];
                    info.activity = /[\s\S]+activity[\s\S]+?android:name.+?"(.+?)"[\s\S]+?android.intent.category.LAUNCHER/g.exec(stdout)[1];
                } catch (e) {
                    throw new Error('aapt parse err ' + e);
                }

                return info;
            })
    },

    screenshot: function (device) {
        var adbCmd = new AdbCmd(device);
        return adbCmd.exec('shell screencap -p /sdcard/screen.png')
            .then(function () {
                return adbCmd.exec('pull /sdcard/screen.png screenshot/')
            })
            .then(function () {
                return adbCmd.exec('shell rm /sdcard/screen.png');
            })
            .then(function () {
                return 'screenshot/.screen.png';
            })
    }
};
