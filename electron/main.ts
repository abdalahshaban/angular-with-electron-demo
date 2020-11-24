import { app, BrowserWindow, screen, ipcMain, Notification, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { PKCS11 } from "pkcs11js";
import { NotificationConstructorOptions } from 'electron/main';

let win: BrowserWindow = null;
var pkcs11;
let tray = null;

const gotTheLock = app.requestSingleInstanceLock();


if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })

    // Create win, load the rest of the app, etc...
    app.whenReady().then(() => {
        win = createWindow()
    })
}

var AutoLaunch = require('auto-launch');

var autoLauncher = new AutoLaunch({
    name: "MyApp"
});

autoLauncher.isEnabled().then(function (isEnabled) {
    if (isEnabled) return;
    autoLauncher.enable();
}).catch(function (err) {
    throw err;
});








function createWindow(): BrowserWindow {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
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
        icon: nativeImage.createFromPath(__dirname + '../cloud_fun.ico'),
        webPreferences: {
            sandbox: true,
            // webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,  // false if you want to run 2e2 test with Spectron
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
    app.on('ready', () => setTimeout(() => {
        createWindow()
        // if (win !== null) {
        // }
        win.hide();
        tray = createTray();
    }, 400));

    function createTray() {
        let appIcon = new Tray(path.join(__dirname, "../cloud_fun.ico"));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show', click: function () {
                    // win.show();
                    new BrowserWindow({
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
                            contextIsolation: false,  // false if you want to run 2e2 test with Spectron
                            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
                        },
                    })
                }
            },
            {
                label: 'Exit', click: function () {
                    app.quit();
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
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            if (win !== null) {

                win.hide();
                createTray()
            }
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

    app.on('select-client-certificate', (event, webContents, url, list, callback) => {
        console.log('select-client-certificate', url, list)
        event.preventDefault()

        ipcMain.once('client-certificate-selected', (event, item) => {
            console.log('selected:', item)
        })
        win.webContents.send('getTokenData', list)

    });


    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        console.log('certificate-error', url)
        event.preventDefault()
        //     const result = ... // do your validation here
        // callback(result)
    });

    app.on('login', (event, webContents, details, authInfo, callback) => {
        console.log('login');
        event.preventDefault()
        // callback('username', 'secret')
    });

    app.on('will-quit', (event) => {
        console.log('will-quit');
    })






    ipcMain.on('getDataToken', async (event, arg) => {

        try {
            console.log('getDataToken1');
            pkcs11 = new PKCS11();
            console.log('pkcs11', pkcs11)
            let dllPath = path.join(__dirname, `../lib/eps2003csp11.dll`);
            pkcs11.load(dllPath);
            console.log('loaded');
            pkcs11.C_Initialize();
            let token_info;
            // Getting info about PKCS11 Module
            var module_info = await pkcs11.C_GetInfo();
            console.log(module_info, 'module_info');

            const options: NotificationConstructorOptions = {
                body: 'Notification Body',
                title: 'notify',
                closeButtonText: 'close button',
                replyPlaceholder: 'replyPlaceholder',
                urgency: 'critical',
            };

            Notification
            const notification = new Notification(options)



            notification.on('click', (event) => {
                event.preventDefault()
                console.log('event on');
            });

            notification.on('close', (event) => {
                console.log(event, 'close');
                // console.log(event.preventDefault());
            })



            notification.show();

            win.webContents.send('getDataTokenRes', module_info);




            // Getting list of slots
            var slots = pkcs11.C_GetSlotList(true);
            // console.log(slots, 'slots');
            var slot = slots[0];

            console.log(slot, 'slot')

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
    });

    ipcMain.on('test', (event, arg) => {
        console.log('test in electron');
    })



} catch (e) {
    // Catch Error
    // throw e;
}
