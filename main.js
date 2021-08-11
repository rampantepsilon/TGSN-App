const { app, BrowserView, BrowserWindow, Menu, Tray, Notification, globalShortcut, shell, dialog, ipcMain } = require('electron');
const https = require('https');
const path = require('path');
const fs = require('fs');
const Store = require('./src/store.js');
//const axios = require('axios');

//Change Before Building
var devBuild = 'false';
//var devBuild = 'true';

//Information
function title(){
    var title = 'TGSN Staff HQ v0.1.6-beta';
    return title;
}
function buildNum(){
    var build = '21.08.1';
    return build;
}
const currentVer = app.getVersion(); //Version Variable
const changelogOptions = {
    type: 'info',
    buttons: ['Close'],
    title: 'Changelog',
    message: 'Changes in TGSN Staff HQ v0.1.6-beta',
    detail: `
  - Background work for upcoming navigation changes
  - Removed TVS Staff and TVS Coordinator positions from User Management
  - Changed how the link bar handles permissions (This will continue to be modified going forward to accomodate if Staff needs additional pages)
  - Fixed bug when changing a users position it would blank out the password
  - Stability changes and backend changes

  Next Update
  - Add Show Notes (TGS, TGSR, TVS)
  - Add Recent Videos Editor

  If you have any suggestions for the app, please reach out to me on Twitter @rampantepsilon or Discord (RampantEpsilon#7868).`
  }

//Global Variables
let tray;
let mainWindow; //MainWindow tracker
var homeWindow; //Var to know the state of MainWindow
var notifications; //Notification Toggle
var launchCheck = 'true';

//Storage
const store = new Store({
  configName: 'user-prefences',
  defaults: {
    min2Tray: 'false',
    showNotifs: 'true'
  }
})
const storeInfo = new Store({
  configName: 'user-info',
  defaults: {
    loggedIn: 'no',
    access: 'guest'
  }
})

//Determine Menu
var min2Tray = store.get('min2Tray');

//App Menu
let menuTemplate = [
    {
        label: 'App',
        submenu: [
          {
            label: 'Minimize On Close',
            type: 'checkbox',
            id: 'min2TrayMenu',
            click: function (item) {
              if (item.checked == true){
                min2Tray = 'true';
                store.set('min2Tray', 'true');
                console.log(min2Tray)
              } else {
                min2Tray = 'false';
                store.set('min2Tray', 'false')
                console.log(min2Tray)
              }
            }
          },{
              type: 'separator'
          },{
              label: 'Reload',
              role: 'reload',
              accelerator: 'F5'
          },{
              label: 'Clear Cache & Reload',
              role: 'forceReload',
              accelerator: 'CommandOrControl+F5'
          },{
              type: 'separator'
          },{
              label: 'Toggle Full Screen',
              role: 'togglefullscreen',
              accelerator: 'CommandOrControl+F11'
          },{
              type: 'separator'
          },{
            label: 'Minimize',
            role: 'minimize',
            accelerator: 'CommandOrControl+M'
          },{
            label: 'Close',
            role: 'close',
            accelerator: 'CommandOrControl+W'
          }
        ]
    },
    {
        label: 'Edit',
        submenu: [
        {
            label: 'Undo',
            role: 'undo',
            accelerator: 'CommandOrControl+Z'
        },{
            label: 'Redo',
            role: 'redo',
            accelerator: 'CommandOrControl+Y'
        },{
            type: 'separator'
        },{
            label: 'Cut',
            role: 'cut',
            accelerator: 'CommandOrControl+X'
        },{
            label: 'Copy',
            role: 'copy',
            accelerator: 'CommandOrControl+C'
        },{
            label: 'Paste',
            role: 'paste',
            accelerator: 'CommandOrControl+V'
        },{
            label: 'Delete',
            role: 'delete'
        },{
            type: 'separator'
        },{
            label: 'Select All',
            role: 'selectAll',
            accelerator: 'CommandOrControl+A'
        }
        ]
    },{
        label: 'About',
        role: 'about',
        submenu: [
        {
            label: title(),
            enabled: false,
        },{
            label: "Version " + currentVer,
            enabled: false,
        },{
            label: "Build: " + buildNum(),
            enabled: false,
        },{
            label: "Changelog",
            click(){
            changeLog()
            }
        }
        ]
    }
]

let menuCTemplate = [
    {
        label: 'App',
        submenu: [
          {
            label: 'Minimize On Close',
            type: 'checkbox',
            id: 'min2TrayMenu',
            checked: true,
            click: function (item) {
              if (item.checked == true){
                min2Tray = 'true';
                store.set('min2Tray', 'true');
                console.log(min2Tray)
              } else {
                min2Tray = 'false';
                store.set('min2Tray', 'false')
                console.log(min2Tray)
              }
            }
          },{
              type: 'separator'
          },{
              label: 'Reload',
              role: 'reload',
              accelerator: 'F5'
          },{
              label: 'Clear Cache & Reload',
              role: 'forceReload',
              accelerator: 'CommandOrControl+F5'
          },{
              type: 'separator'
          },{
              label: 'Toggle Full Screen',
              role: 'togglefullscreen',
              accelerator: 'CommandOrControl+F11'
          },{
              type: 'separator'
          },{
            label: 'Minimize',
            role: 'minimize',
            accelerator: 'CommandOrControl+M'
          },{
            label: 'Close',
            role: 'close',
            accelerator: 'CommandOrControl+W'
          }
        ]
    },
    {
        label: 'Edit',
        submenu: [
        {
            label: 'Undo',
            role: 'undo',
            accelerator: 'CommandOrControl+Z'
        },{
            label: 'Redo',
            role: 'redo',
            accelerator: 'CommandOrControl+Y'
        },{
            type: 'separator'
        },{
            label: 'Cut',
            role: 'cut',
            accelerator: 'CommandOrControl+X'
        },{
            label: 'Copy',
            role: 'copy',
            accelerator: 'CommandOrControl+C'
        },{
            label: 'Paste',
            role: 'paste',
            accelerator: 'CommandOrControl+V'
        },{
            label: 'Delete',
            role: 'delete'
        },{
            type: 'separator'
        },{
            label: 'Select All',
            role: 'selectAll',
            accelerator: 'CommandOrControl+A'
        }
        ]
    },{
        label: 'About',
        role: 'about',
        submenu: [
        {
            label: title(),
            enabled: false,
        },{
            label: "Version " + currentVer,
            enabled: false,
        },{
            label: "Build: " + buildNum(),
            enabled: false,
        },{
            label: "Changelog",
            click(){
            changeLog()
            }
        }
        ]
    }
]

let devTemplate = [
    {
        label: 'App',
        submenu: [
          {
            label: 'Minimize On Close',
            type: 'checkbox',
            id: 'min2TrayMenu',
            click: function (item) {
              if (item.checked == true){
                min2Tray = 'true';
                store.set('min2Tray', 'true');
                console.log(min2Tray)
              } else {
                min2Tray = 'false';
                store.set('min2Tray', 'false')
                console.log(min2Tray)
              }
            }
          },{
              type: 'separator'
          },{
              label: 'Reload',
              role: 'reload',
              accelerator: 'F5'
          },{
              label: 'Clear Cache & Reload',
              role: 'forceReload',
              accelerator: 'CommandOrControl+F5'
          },{
              label: 'Toggle Dev Tools',
              role: 'toggledevtools',
              accelerator: 'CommandOrControl+Alt+I',
          },{
              type: 'separator'
          },{
              label: 'Toggle Full Screen',
              role: 'togglefullscreen',
              accelerator: 'CommandOrControl+F11'
          },{
              type: 'separator'
          },{
            label: 'Minimize',
            role: 'minimize',
            accelerator: 'CommandOrControl+M'
          },{
            label: 'Close',
            role: 'close',
            accelerator: 'CommandOrControl+W'
          }
        ]
    },
    {
        label: 'Edit',
        submenu: [
        {
            label: 'Undo',
            role: 'undo',
            accelerator: 'CommandOrControl+Z'
        },{
            label: 'Redo',
            role: 'redo',
            accelerator: 'CommandOrControl+Y'
        },{
            type: 'separator'
        },{
            label: 'Cut',
            role: 'cut',
            accelerator: 'CommandOrControl+X'
        },{
            label: 'Copy',
            role: 'copy',
            accelerator: 'CommandOrControl+C'
        },{
            label: 'Paste',
            role: 'paste',
            accelerator: 'CommandOrControl+V'
        },{
            label: 'Delete',
            role: 'delete'
        },{
            type: 'separator'
        },{
            label: 'Select All',
            role: 'selectAll',
            accelerator: 'CommandOrControl+A'
        }
        ]
    },{
        label: 'About',
        role: 'about',
        submenu: [
        {
            label: title(),
            enabled: false,
        },{
            label: "Version " + currentVer,
            enabled: false,
        },{
            label: "Build: " + buildNum(),
            enabled: false,
        },{
            label: "Changelog",
            click(){
            changeLog()
            }
        }
        ]
    }
]

let devCTemplate = [
    {
        label: 'App',
        submenu: [
          {
            label: 'Minimize On Close',
            type: 'checkbox',
            id: 'min2TrayMenu',
            checked: true,
            click: function (item) {
              if (item.checked == true){
                min2Tray = 'true';
                store.set('min2Tray', 'true');
                console.log(min2Tray)
              } else {
                min2Tray = 'false';
                store.set('min2Tray', 'false')
                console.log(min2Tray)
              }
            }
          },{
              type: 'separator'
          },{
              label: 'Reload',
              role: 'reload',
              accelerator: 'F5'
          },{
              label: 'Clear Cache & Reload',
              role: 'forceReload',
              accelerator: 'CommandOrControl+F5'
          },{
              label: 'Toggle Dev Tools',
              role: 'toggledevtools',
              accelerator: 'CommandOrControl+Alt+I',
          },{
              type: 'separator'
          },{
              label: 'Toggle Full Screen',
              role: 'togglefullscreen',
              accelerator: 'CommandOrControl+F11'
          },{
              type: 'separator'
          },{
            label: 'Minimize',
            role: 'minimize',
            accelerator: 'CommandOrControl+M'
          },{
            label: 'Close',
            role: 'close',
            accelerator: 'CommandOrControl+W'
          }
        ]
    },
    {
        label: 'Edit',
        submenu: [
        {
            label: 'Undo',
            role: 'undo',
            accelerator: 'CommandOrControl+Z'
        },{
            label: 'Redo',
            role: 'redo',
            accelerator: 'CommandOrControl+Y'
        },{
            type: 'separator'
        },{
            label: 'Cut',
            role: 'cut',
            accelerator: 'CommandOrControl+X'
        },{
            label: 'Copy',
            role: 'copy',
            accelerator: 'CommandOrControl+C'
        },{
            label: 'Paste',
            role: 'paste',
            accelerator: 'CommandOrControl+V'
        },{
            label: 'Delete',
            role: 'delete'
        },{
            type: 'separator'
        },{
            label: 'Select All',
            role: 'selectAll',
            accelerator: 'CommandOrControl+A'
        }
        ]
    },{
        label: 'About',
        role: 'about',
        submenu: [
        {
            label: title(),
            enabled: false,
        },{
            label: "Version " + currentVer,
            enabled: false,
        },{
            label: "Build: " + buildNum(),
            enabled: false,
        },{
            label: "Changelog",
            click(){
            changeLog()
            }
        }
        ]
    }
]

//Decide which menu to show
if (devBuild == 'true'){
  if (min2Tray == 'true'){
    var menu = Menu.buildFromTemplate(devCTemplate); //Add Template to Menu
  } else {
    var menu = Menu.buildFromTemplate(devTemplate); //Add Template to Menu
  }
} else {
  if (min2Tray == 'true'){
    var menu = Menu.buildFromTemplate(menuCTemplate); //Add Template to Menu
  } else {
    var menu = Menu.buildFromTemplate(menuTemplate); //Add Template to Menu
  }
}

//Function for Changelog
function changeLog(){
    dialog.showMessageBox(null, changelogOptions, (response, checkboxChecked) =>{});
}

function createWindow(){
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        title: title(),
        icon: __dirname + 'logo.ico',
        webPreferences: {
            nativeWindowOpen: true,
            webviewTag: true,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    mainWindow.loadFile('src/index.html');

    Menu.setApplicationMenu(menu);

    mainWindow.on('close', function(event){
      event.preventDefault();
      if (min2Tray == 'false'){
        dialog.showMessageBox(mainWindow, {
          type: 'question',
          buttons: ['Yes', 'No'],
          defaultID: 1,
          title: 'Minimize To Tray',
          //checkboxLabel: 'Remember This Session',
          message: 'Do you wish to minimize this window to the tray?'
        })
          .then(result => {
            if (result.response === 1){
              storeInfo.set('loggedIn', 'no');
              storeInfo.set('access', 'guest');
              mainWindow.destroy();
              app.quit();
            } else {
              mainWindow.hide();
              /*if (result.checkboxChecked == true){
                checkMin2Tray();
              }*/
            }
          })
      } else {
        mainWindow.hide();
      }
    })

    //Initialize Tray
    tray = new Tray(__dirname + '/logo_20x20.jpg');
    //Tray Menu Items
    const trayOptions = [
        {
        label: 'TGSN Staff HQ',
        enabled: false,
        icon: __dirname + '/logo_20x20.jpg'
        },{
        type: 'separator'
        },{
        label: 'Open TGSN Staff HQ',
        click: function () {
            mainWindow.show();
          }
        },{
        type: 'separator'
        },{
        label: 'Quit',
        click: function () {
            storeInfo.set('loggedIn', 'no');
            storeInfo.set('access', 'guest');
            mainWindow.destroy();
            app.quit();
          }
        }
    ];
    const trayMenu = Menu.buildFromTemplate(trayOptions);
    //Set Tray Menu
    tray.setContextMenu(trayMenu);

    //Add tray click function
    if (process.platform == 'win32'){
        tray.on('click', function(){
        tray.popUpContextMenu();
        })
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

if (process.platform === 'win32')
  {
      app.setAppUserModelId("TGSN Staff HQ")
  }

app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy')

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {

    // Check for a webview
    if (contents.getType() == 'webview') {

      // Listen for any new window events
      contents.on('new-window', (e, url) => {
        e.preventDefault();
        let win = new BrowserWindow({
            width: 1200,
            height: 675,
            title: title(),
            webPreferences: {
                nativeWindowOpen: true,
                webviewTag: true
            }
        });
        win.loadURL(url);
        //shell.openExternal(url)
      })
    }
  })
