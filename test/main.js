/**
 * Created by cc on 7/25/15.
 */
"use strict";

var adb = require('../adb');

describe('Test adb', function () {

    it("Should get devices", function () {
       return adb.getDevices().then(function (devices) {
           console.log("devices = " + devices);
       })
    })
})