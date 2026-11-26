const { app, BrowserWindow, ipcMain, shell, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

const dataFile = () => path.join(app.getPath('userData'), 'study-data.json');
function readData() {
  try { return JSON.parse(fs.readFileSync(dataFile(), 'utf8')); }
  catch { return { studies: [], notes: [], highlights: [], settings: { dailyMinutes: 30, studyTime: '18:00', reminder: true } }; }
}
function writeData(data) {
  fs.mkdirSync(path.dirname(dataFile()), { recursive: true });
  fs.writeFileSync(dataFile(), JSON.stringify(data, null, 2), 'utf8');
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1050, minHeight: 700,
    backgroundColor: '#f5f5f1',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('data:load', () => readData());
ipcMain.handle('data:save', (_, data) => { writeData(data); return true; });
ipcMain.handle('file:import', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [
    { name: 'Study documents', extensions: ['pdf', 'txt', 'md', 'docx'] },
    { name: 'All files', extensions: ['*'] }
  ]});
  if (result.canceled || !result.filePaths[0]) return null;
  const source = result.filePaths[0];
  const destDir = path.join(app.getPath('userData'), 'publications');
  fs.mkdirSync(destDir, { recursive: true });
  const safeName = path.basename(source).replace(/[^\w.\- ]/g, '_');
  let dest = path.join(destDir, safeName);
  if (fs.existsSync(dest)) dest = path.join(destDir, `${Date.now()}-${safeName}`);
  fs.copyFileSync(source, dest);
  return { name: path.basename(dest), path: dest, type: path.extname(dest).slice(1).toLowerCase() };
});
ipcMain.handle('file:open', async (_, filePath) => {
  if (typeof filePath !== 'string') return false;
  return shell.openPath(filePath);
});
ipcMain.handle('url:open', async (_, url) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'jw.org' && !parsed.hostname.endsWith('.jw.org')) return false;
    await shell.openExternal(url); return true;
  } catch { return false; }
});
ipcMain.handle('reminder:notify', (_, title, body) => {
  if (Notification.isSupported()) new Notification({ title, body }).show();
  return true;
});