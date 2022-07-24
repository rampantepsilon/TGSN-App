const { app, BrowserView, BrowserWindow, Menu, Tray, Notification, globalShortcut, shell, dialog, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const https = require('https');
const path = require('path');
const fs = require('fs');
const {localStorage, sessionStorage} = require('electron-browser-storage');

//Change Before Building
//var devBuild = 'false';
var devBuild = 'true';

//Information
function title(){
    var title = 'TGSN Staff HQ v3.0.1-beta';
    return title;
}
function buildNum(){
    var build = '22.7.24';
    return build;
}
const currentVer = app.getVersion(); //Version Variable
const changelogOptions = {
    type: 'info',
    buttons: ['Close'],
    title: 'Changelog',
    message: 'Changes in TGSN Staff HQ v3.0.1-beta',
    detail: `
  - Minor bug fix for User Management
  - Added ability to see articles and videos for TGSR from the Show Resource Management page
  - All show resources can now be side loaded while watching the stream

  Coming Soon
  - Show Resources will show up as a button in the bottom of the app on stream days.

  If you have any suggestions for the app, please reach out to me on Twitter @rampantepsilon or Discord (RampantEpsilon#7868).`
  }

//Global Variables
let tray;
let mainWindow; //MainWindow tracker
var win;
var homeWindow; //Var to know the state of MainWindow
var notifications; //Notification Toggle
var launchCheck = 'true';

//App Menu
let menuTemplate = [
    {
        label: 'App',
        submenu: [
          {
            label: 'Minimize On Close',
            id: 'min2TrayMenu',
            click: function (item) {
              dialog.showMessageBox(mainWindow, {
                type: 'question',
                buttons: ['Yes', 'No'],
                defaultID: 1,
                title: 'Minimize To Tray',
                message: 'Do you wish to minimize this window to the tray?'
              })
              .then(result => {
                if (result.response === 1){
                  localStorage.setItem('min2Tray', false);
                } else {
                  localStorage.setItem('min2Tray', true);
                }
              })
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
    },
    {
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
            id: 'min2TrayMenu',
            click: function (item) {
              dialog.showMessageBox(mainWindow, {
                type: 'question',
                buttons: ['Yes', 'No'],
                defaultID: 1,
                title: 'Minimize To Tray',
                message: 'Do you wish to minimize this window to the tray?'
              })
              .then(result => {
                if (result.response === 1){
                  localStorage.setItem('min2Tray', false);
                } else {
                  localStorage.setItem('min2Tray', true);
                }
              })
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
    },
    {
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
  var menu = Menu.buildFromTemplate(devTemplate); //Add Template to Menu
} else {
  var menu = Menu.buildFromTemplate(menuTemplate); //Add Template to Menu
}

//Function for Changelog
function changeLog(){
    dialog.showMessageBox(null, changelogOptions, (response, checkboxChecked) =>{});
}

async function removeStorage(){
  var rMe = await localStorage.getItem('rememberMe');
  if (rMe == 'no'){
    await localStorage.removeItem('username');
    await localStorage.removeItem('logo');
    await localStorage.removeItem('position');
    await localStorage.removeItem('menuAccess');
  }
}

async function createWindow(){
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        title: title(),
        icon: __dirname + 'logo.ico',
        webPreferences: {
            nativeWindowOpen: true,
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainWindow.loadFile('src/index.html');

    Menu.setApplicationMenu(menu);

    mainWindow.on('close', async function(event){
      event.preventDefault();
      var min2Tray = await localStorage.getItem('min2Tray');
      if (min2Tray == 'false'){
        dialog.showMessageBox(mainWindow, {
          type: 'question',
          buttons: ['Yes', 'No'],
          defaultID: 1,
          title: 'Minimize To Tray',
          checkboxLabel: 'Remember This?',
          message: 'Do you wish to minimize this window to the tray?'
        })
          .then(result => {
            if (result.response === 1){
              removeStorage();
              localStorage.setItem('min2Tray', false);
              setTimeout(function(){
                mainWindow.destroy();
                app.quit();
              },500);
            } else {
              win.close();
              win = null;
              mainWindow.hide();
              if (result.checkboxChecked == true){
                localStorage.setItem('min2Tray', true);
              }
            }
          })
      } else {
        win.close();
        win = null;
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
            removeStorage();
            setTimeout(function(){
              mainWindow.destroy();
              app.quit();
            },500);
          }
        }
    ];
    const trayMenu = Menu.buildFromTemplate(trayOptions);
    //Set Tray Menu
    tray.setContextMenu(trayMenu);

    //Add tray click function
    if (process.platform == 'win32'){
      tray.on('double-click', function(){
        mainWindow.show();
      })
      tray.on('right-click', function(){
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

var approvedLinks=['./tgs.html', './releases/index.html', './shows/view/tgsr.html']

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {
  // Listen for any new window events
  contents.on('new-window', (e, url) => {
    e.preventDefault();
    //shell.openExternal(url);
    console.log(url)
    console.log(url.startsWith('https://'))
    if (url.startsWith('https://') == true || url.startsWith('http://') == true){
      shell.openExternal(url)
    } else {
      win = new BrowserWindow({
          width: 1200,
          height: 675,
          title: title(),
          webPreferences: {
              nativeWindowOpen: true,
              webviewTag: true
          }
      });
      win.loadURL(url);
    }
  })
})
