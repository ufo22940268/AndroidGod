/**
 * Created by ccheng on 7/31/15.
 */
"use strict";

var adb = require('../adb');
var SAMPLE_APK = "./test/fixture/zssq-Activity.apk";
var expect = require('chai').expect;

describe('Test adb', function () {

    context("Parse adb info", function () {

        it("Should parse packageName", function () {
            return adb.aaptParseInfo(SAMPLE_APK)
                .then(function (info) {
                    expect(info.package).to.equal('com.ushaqi.zhuishushenqi');
                    expect(info.activity).to.equal('com.ushaqi.zhuishushenqi.ui.SplashActivity');
                });
        })
    })
})