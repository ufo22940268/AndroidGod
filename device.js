"use strict";

module.exports = Device;

function Device(name) {
    this.name = name;
    this.type = this.isDevice(name) ? "device" : "emulator";
}

Device.prototype.toString = function () {
    return "name: " + this.name + "\t"
        + "type: " + this.type;
}


Device.prototype.isDevice = function (name) {
    return !/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(name.trim());
}
