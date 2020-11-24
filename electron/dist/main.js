"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const pkcs11js_1 = require("pkcs11js");
var AutoLaunch = require('auto-launch');
var autoLauncher = new AutoLaunch({
    name: "MyApp"
});
autoLauncher.isEnabled().then(function (isEnabled) {
    if (isEnabled)
        return;
    autoLauncher.enable();
}).catch(function (err) {
    throw err;
});
let win = null;
var pkcs11;
let tray = null;
function createWindow() {
    const electronScreen = electron_1.screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        // x: 0,
        // y: 0,
        // width: size.width,
        // height: size.height,
        // width: 800,
        // height: 600,
        frame: false,
        minimizable: true,
        show: false,
        backgroundColor: '#FFFF00',
        webPreferences: {
            sandbox: true,
            // webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
    });
    win.webContents.openDevTools();
    win.loadURL(url.format({
        pathname: path.join(__dirname, `../../dist/index.html`),
        protocol: 'file:',
        slashes: true
    }));
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    win.on('restore', function (event) {
        win.show();
        tray.destroy();
    });
    // win.on('minimize', function (event) {
    //     event.preventDefault();
    //     win.hide();
    //     tray = createTray();
    // });
    return win;
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', () => setTimeout(() => {
        createWindow();
        // if (win !== null) {
        // }
        win.hide();
        tray = createTray();
    }, 400));
    function createTray() {
        let appIcon = new electron_1.Tray(path.join(__dirname, "../cloud_fun.ico"));
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: 'Show', click: function () {
                    // win.show();
                    new electron_1.BrowserWindow({
                        icon: '/../cloud_fun.ico',
                        // x: 0,
                        // y: 0,
                        // width: size.width,
                        // height: size.height,
                        width: 800,
                        height: 600,
                        // frame: false,
                        // minimizable: true,
                        // show: false,
                        backgroundColor: '#808000',
                        webPreferences: {
                            sandbox: true,
                            // webSecurity: false,
                            nodeIntegration: true,
                            contextIsolation: false,
                            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
                        },
                    });
                }
            },
            {
                label: 'Exit', click: function () {
                    electron_1.app.quit();
                }
            },
        ]);
        appIcon.on('double-click', function (event) {
            win.show();
        });
        appIcon.setToolTip('AppDriver');
        appIcon.setContextMenu(contextMenu);
        return appIcon;
    }
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            if (win !== null) {
                win.hide();
                createTray();
            }
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
    // app.on('select-client-certificate', (event, webContents, url, list, callback) => {
    //     event.preventDefault();
    //     console.log(event, 'event');
    //     console.log(webContents, 'webContents');
    //     console.log(url, 'url');
    //     console.log(list, 'list');
    //     win.webContents.send("getTokenData", [event, webContents, url, list, callback]);
    //     callback(list[0]);
    // });
    electron_1.app.on('select-client-certificate', (event, webContents, url, list, callback) => {
        console.log('select-client-certificate', url, list);
        event.preventDefault();
        electron_1.ipcMain.once('client-certificate-selected', (event, item) => {
            console.log('selected:', item);
        });
        win.webContents.send('getTokenData', list);
    });
    electron_1.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        console.log('certificate-error', url);
        event.preventDefault();
        //     const result = ... // do your validation here
        // callback(result)
    });
    electron_1.app.on('login', (event, webContents, details, authInfo, callback) => {
        console.log('login');
        event.preventDefault();
        // callback('username', 'secret')
    });
    electron_1.app.on('will-quit', (event) => {
        console.log('will-quit');
    });
    electron_1.ipcMain.on('getDataToken', (event, arg) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            console.log('getDataToken1');
            pkcs11 = new pkcs11js_1.PKCS11();
            console.log('pkcs11', pkcs11);
            let dllPath = path.join(__dirname, `../lib/eps2003csp11.dll`);
            pkcs11.load(dllPath);
            console.log('loaded');
            pkcs11.C_Initialize();
            let token_info;
            // Getting info about PKCS11 Module
            var module_info = yield pkcs11.C_GetInfo();
            console.log(module_info, 'module_info');
            const options = {
                body: 'Notification Body',
                title: 'notify',
                closeButtonText: 'close button',
                replyPlaceholder: 'replyPlaceholder',
                urgency: 'critical',
            };
            electron_1.Notification;
            const notification = new electron_1.Notification(options);
            notification.on('click', (event) => {
                event.preventDefault();
                console.log('event on');
            });
            notification.on('close', (event) => {
                console.log(event, 'close');
                // console.log(event.preventDefault());
            });
            notification.show();
            win.webContents.send('getDataTokenRes', module_info);
            // Getting list of slots
            var slots = pkcs11.C_GetSlotList(true);
            // console.log(slots, 'slots');
            var slot = slots[0];
            console.log(slot, 'slot');
            // // Getting info about slot
            var slot_info = pkcs11.C_GetSlotInfo(slot);
            console.log(slot_info, 'slot_info');
            // Getting info about token
            token_info = pkcs11.C_GetTokenInfo(slot);
            console.log(token_info, 'token_info');
            // Getting info about Mechanism
            var mechs = pkcs11.C_GetMechanismList(slot);
            console.log(mechs, 'mechs');
            var mech_info = pkcs11.C_GetMechanismInfo(slot, mechs[0]);
            console.log(mech_info, 'mech_info');
            var session = pkcs11.C_OpenSession(slot, pkcs11.CKF_RW_SESSION | pkcs11.CKF_SERIAL_SESSION);
            console.log(session, 'session');
            // Getting info about Session
            var info = pkcs11.C_GetSessionInfo(session);
            pkcs11.C_Login(session, 1, "11112222");
            /**
             * Your app code here
             */
            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);
            win.webContents.send('getDataTokenRes', module_info);
        }
        catch (e) {
            console.error(e, 'error');
        }
        finally {
            pkcs11.C_Finalize();
        }
    }));
    electron_1.ipcMain.on('test', (event, arg) => {
        console.log('test in electron');
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map