import { fork } from 'child_process';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

const IS_DEV_MODE = /[\\/]electron/.test(process.execPath);

let mainWindow;

if (IS_DEV_MODE) {
  enableLiveReload({ strategy: 'react-hmr' });
}

app.on('ready', () => {
  createWindow();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

async function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    minHeight: 600,
    minWidth: 800,
    webPreferences: { nodeIntegration: true },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (IS_DEV_MODE) {
    await installExtension(REACT_DEVELOPER_TOOLS);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();

    if (IS_DEV_MODE) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const backendProcessPath = IS_DEV_MODE ? path.join(__dirname, 'backend') : 'app.asar/src/backend';

const currentWorkingDirectory = IS_DEV_MODE ? null : path.join(__dirname, '..', '..');

const backendProcess = fork(backendProcessPath, [], {
  currentWorkingDirectory,
});

backendProcess.on('message', (message) => {
  mainWindow.webContents.send(message.channel, message);
});

ipcMain.on('backend', (event, message) => backendProcess.send(message));
