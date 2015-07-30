var adb = require('./adb');

adb.getDevices().then(function (devices) {
    var leftPart = document.getElementsByClassName('left-part').item(0);

    var activeIndex = 0;
    var leftRactive = new Ractive({
        el: '#left-part',
        template: '#left-template',
        data: {devices: devices.map(function (t, index) {
            return {
                deviceName: t.name,
                imageSrc: t.type == 'emulator' ? "img/ic_desktop_mac_white_48dp_2x.png" : "img/ic_phone_android_white_48dp_2x.png",
                active: activeIndex == index
            }
        })}
    });

    var rightRactive = new Ractive({
        el: '#right-part',
        template: '#right-template'
    })
})

