import { app, BrowserWindow } from 'electron';
import database from './database';
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
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

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

database.initialize();
