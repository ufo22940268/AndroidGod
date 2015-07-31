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
})


var dropAreaLabel = document.getElementById("drop-area-label");
ipc.on('getDevices-reply', function (devices) {
    onHandleDevices(devices);
})

function initDropArea() {
    dropAreaLabel.innerHTML = "Drop to install";
}
ipc.on('installApk-reply', function (result) {
    console.log("result = " + JSON.stringify(result))
    if (result.err) {
        alert(result.err);
        initDropArea();
    } else {
        dropAreaLabel.innerText = "Success";
    }
})

var onHandleDevices = function (devices) {
    onlineDevices = devices;
    var leftPart = document.getElementsByClassName('left-part').item(0);
    leftRactive.set({
        devices: devices.map(function (t, index) {
            return {
                deviceName: t.name,
                imageSrc: t.type == 'emulator' ? "img/ic_desktop_mac_white_48dp_2x.png" : "img/ic_phone_android_white_48dp_2x.png",
                active: activeIndex == index
            }
        })
    });


    leftRactive.on('selectDevice', function (event) {
        activeIndex = event.index.i;
        leftRactive.findAll('.device-item').forEach(function (node, i) {
            if (i == event.index.i) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        })
    })

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
