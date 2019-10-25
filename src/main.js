import { fork } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import { enableLiveReload } from 'electron-compile';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';

const isDevMode = /[\\/]electron/.test(process.execPath);

const backendProcessPath = isDevMode ? path.join(__dirname, 'backend') : 'resources/app.asar/src/backend';
const currentWorkingDirectory = isDevMode ? null : path.join(__dirname, '..', '..');

const backendProcess = fork(backendProcessPath, [], {
  currentWorkingDirectory,
});

let mainWindow;

if (isDevMode) {
  enableLiveReload({ strategy: 'react-hmr' });
}

app.on('activate', handleActivate);
app.on('ready', handleReady);
app.on('window-all-closed', handleWindowAllClosed);
backendProcess.on('message', handleBackendProcessMessage);
ipcMain.on('backend-request', handleBackendRequest);

function handleActivate() {
  if (isMainWindowClosed()) {
    createWindow();
  }
}

function isMainWindowClosed() {
  return mainWindow === null;
}

function handleReady() {
  createWindow();
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    show: false,
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.once('ready-to-show', handleReadyToShow);
  mainWindow.on('closed', handleClosed);
  if (isDevMode) {
    await installAndOpenDevTools();
  }
}

function handleReadyToShow() {
  mainWindow.maximize();
  mainWindow.show();
}

async function installAndOpenDevTools() {
  await installExtension(REACT_DEVELOPER_TOOLS);
  mainWindow.webContents.openDevTools();
}

function handleClosed() {
  mainWindow = null;
}

function handleWindowAllClosed() {
  if (!isPlatformDarwin()) {
    app.quit();
  }
}

function isPlatformDarwin() {
  return process.platform === 'darwin';
}

function handleBackendProcessMessage(message) {
  mainWindow.webContents.send('backend-response', message);
}

function handleBackendRequest(event, request) {
  backendProcess.send(request);
}
