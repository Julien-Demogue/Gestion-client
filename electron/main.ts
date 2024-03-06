import { app, BrowserWindow,dialog,ipcMain} from 'electron';
import path from 'node:path';
import fs from 'fs';


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width:1920,
    height:1080,
    backgroundColor: '#D5F0FF',
    fullscreen:true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Methode ouvrant un menu permettant d'enregistrer les donnees client 
const saveFile = () => {
  const date = new Date().toLocaleDateString('fr-FR').replaceAll("/","-");
  const options = {
    title: 'Sauvegarder les données client',
    defaultPath: app.getPath('downloads') + ("/fichier_client (" + date +")"),
    filters: [
      { name: 'Fichiers json', extensions: ['json'] },
      { name: 'Tous les fichiers', extensions: ['*'] },
    ],
  };

  if(win){
    dialog.showSaveDialog(win , options).then(async (result) => {
      if (result.filePath) {
        try {
          const data = await fs.promises.readFile('./src/data/clients.json', 'utf-8');
          await fs.writeFile(result.filePath, data, err => {
            console.error(err);
          });
          console.log(`Fichier enregistre : ${result.filePath}`);
        } catch (error:any) {
          console.error(`Erreur lors de l'enregistrement du fichier : ${error.message}`);
        }
      } else {
        console.log('Enregistrement annule');
      }
    });
  }
};

ipcMain.on('save-data', (event, arg) => {
  saveFile();
})

app.whenReady().then(createWindow)
