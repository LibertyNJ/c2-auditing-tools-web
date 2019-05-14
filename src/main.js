import { fork } from 'child_process';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600,
    webPreferences: { nodeIntegration: true },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();

    if (isDevMode) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const databasePath = isDevMode
  ? path.join(__dirname, 'database.js')
  : 'app.asar/src/database.js';

const cwd = isDevMode ? null : path.join(__dirname, '..', '..');

const db = fork(databasePath, [], { cwd });

db.on('message', data => mainWindow.webContents.send(data.header.type, data));
ipcMain.on('database', (event, data) => db.send(data));
