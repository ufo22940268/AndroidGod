var ipc = require('ipc')

ipc.send('getDevices')
ipc.on('getDevices-reply', function (devices) {
    onFulfilled(devices);
})

var onFulfilled = function (devices) {
    var leftPart = document.getElementsByClassName('left-part').item(0);

    var activeIndex = 0;
    var leftRactive = new Ractive({
        el: '#left-part',
        template: '#left-template',
        data: {
            devices: devices.map(function (t, index) {
                return {
                    deviceName: t.name,
                    imageSrc: t.type == 'emulator' ? "img/ic_desktop_mac_white_48dp_2x.png" : "img/ic_phone_android_white_48dp_2x.png",
                    active: activeIndex == index
                }
            })
        }
    });

    var rightRactive = new Ractive({
        el: '#right-part',
        template: '#right-template'
    })

    var dropArea = document.getElementById("drop-area");
    var dropAreaLabel = document.getElementById("drop-area-label");

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
        console.log("ondrop")
        dropAreaLabel.innerText = "Installing...";
        setTimeout(function () {
            dropAreaLabel.innerText = "Installed";
        }, 3000);
        e.preventDefault();
    }
};
//adb.getDevices().then(onFulfilled)

