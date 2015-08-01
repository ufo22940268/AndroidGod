/**
 * Created by cc on 8/1/15.
 */
"use strict";
var ipc = require('ipc');

var leftRactive = new Ractive({
    el: 'body',
    template: '#template',
});

leftRactive.on('saveImage', function (e) {
    ipc.send('showSaveImageDialog', '/screenshot/screen.png');
});

leftRactive.on('reloadImage', function (e) {
    ipc.send('reloadScreenShot');
});

ipc.on('reloadScreenShot-reply', function () {
    location.reload();
});
