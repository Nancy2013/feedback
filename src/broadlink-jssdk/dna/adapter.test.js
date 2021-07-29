

describe('combine', () => {
    beforeAll(() => {
        window.cordova = {
            exec:jest.fn((onSucceed, onFailed, bridge, action, params) => {
                if (action === "deviceinfo") {
                    return onSucceed(JSON.stringify({
                        deviceID: '001',
                        subDeviceID: '0001',
                        deviceStatus: 1,
                        deviceName: 'test device name'
                    }))
                } else if (action === "devicecontrol") {
                    return onSucceed(JSON.stringify({
                        status:0,
                        data:{params:['pwr'],vals:[[{val:'1'}]]}
                    }))
                }
            })
        };

        setTimeout(()=>{
            var evt = new Event('deviceready');
            document.dispatchEvent(evt)
        },1000)
    });

    test('status set should be transformed', () => {
        var adapter = require('./adapter').default;
        return adapter.setDeviceStatus({temp: 1}).then(d => {
            expect(window.cordova.exec.mock.calls[1][4][2]).toEqual(expect.objectContaining({params: ['temp'], vals: [[{val: 1, idx: 1}]]}))
        })
    });

    test('received status should be transformed', () => {
        var adapter = require('./adapter').default;
        return adapter.getDeviceStatus({}).then(data => {
            expect(data.status).toEqual(expect.objectContaining({pwr: '1'}))
        })
    });
    
    test('received status should be updated', () => {
        var adapter = require('./adapter').default;
        return adapter.getDeviceStatus().then(data => {
            expect(data).toEqual({status: {pwr: '1'}, online: '1', name: 'test device name'})
        })
    });

    test('should receive deviceID', () => {
        var adapter = require('./adapter').default;
        return adapter.ready().then(d => {
            expect(d).toEqual(expect.objectContaining({deviceID: '001'}))
        })
    });
});
