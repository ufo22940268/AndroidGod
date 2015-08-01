/**
 * Created by cc on 8/1/15.
 */
"use strict";

var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ImageOperation = require('./imageOperation');

function ImageWindow() {

}

ImageWindow.prototype.show = function () {
// Create the browser window.
    var options = {
        title: 'AndroidGod',
        x: 0,
        y: 0,
        width: 400,
        height: 400
    };
    var webPref = {}
    webPref['overlay-scrollbars'] = true;
    options['web-preferences'] = webPref;
    var window = new BrowserWindow(options);

    new ImageOperation().register(window);

// and load the index.html of the app.
    window.loadUrl('file://' + __dirname + '/image.html');

// Emitted when the window is closed.
    window.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        window = null;
    });
};

module.exports = ImageWindow;
