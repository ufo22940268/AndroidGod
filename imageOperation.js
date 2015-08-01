var ipc = require('ipc');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var dialog = require('dialog');
var ImageWindow = require('./imageWindow');

function Operation() {

}

Operation.prototype.register = function (imageWindow) {
    ipc.on('showSaveImageDialog', function (event, ofn) {
        dialog.showSaveDialog(imageWindow, function (fn) {
            if (fn) {
                fs.createReadStream(path.join(__dirname, ofn)).pipe(fs.createWriteStream(fn));
                imageWindow.close();
            } else {
                console.log("Error file name " + fn);
            }
        })
    })
};

module.exports = Operation;
