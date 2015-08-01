var ipc = require('ipc')
var adb = require('./adb');


var onlineDevices = [];
var activeIndex = 0;

ipc.send('getDevices')

var leftRactive = new Ractive({
    el: '#left-part',
    template: '#left-template',
});

var rightRactive = new Ractive({
    el: '#right-part',
    template: '#right-template'
});

function getActiveDevice() {
    return onlineDevices[activeIndex];
}

rightRactive.on('screenshot', function (e) {
    ipc.send('takeScreenShot', getActiveDevice());

});


var dropAreaLabel = document.getElementById("drop-area-label");

function initDropArea() {
    dropAreaLabel.innerHTML = "Drop to install";
}

function setDevice(device) {
    ipc.send('selectDevice', device);
}

var onHandleDevices = function (devices) {
    onlineDevices = devices;

    if (onlineDevices) {
        activeIndex = onlineDevices.length - 1;
        setDevice(onlineDevices[activeIndex]);
    }

    var leftPart = document.getElementsByClassName('left-part').item(0);
    leftRactive.set({
        devices: devices.map(function (t, index) {
            return {
                deviceName: t.model,
                imageSrc: t.type == 'emulator' ? "img/ic_desktop_mac_white_48dp_2x.png" : "img/ic_phone_android_white_48dp_2x.png",
                active: index === activeIndex
            };
        })
    });

    leftRactive.on('selectDevice', function (event) {
        activeIndex = event.index.i;
        setDevice(onlineDevices[activeIndex]);
        var devices = this.get('devices');
        devices.forEach(function (e, i) {
            e.active = i === activeIndex;
        })
        this.update();
    });

    var dropArea = document.getElementById("drop-area");

    //Disable document drop event
    document.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });


    dropArea.ondrop = function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        if (adb.isApkFile(file.name)) {
            dropAreaLabel.innerText = "Installing...";
            requestInstall(devices[activeIndex], file);
        } else {
            alert("File type incorrect");
        }
    }
};

function requestInstall(device, file) {
    var reader = new FileReader();
    reader.onload = function (event) {
        ipc.send('installApk', device, file.path);
    };
    reader.readAsArrayBuffer(file);
}

function registerIpc() {
    ipc.send('updateDeviceByInterval');

    ipc.on('getDevices-reply', function (devices) {
        onHandleDevices(devices);
    });

    ipc.on('installApk-reply', function (result) {
        if (result.err) {
            alert(result.err);
            initDropArea();
        } else {
            dropAreaLabel.innerText = "Success";
        }
    });

    ipc.on('takeScreenShot-reply', function (imgPath) {
        console.log("imgPath = " + imgPath);
    });
}

registerIpc();
