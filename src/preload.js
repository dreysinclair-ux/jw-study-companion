const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('studyApp', {
  load: () => ipcRenderer.invoke('data:load'),
  save: data => ipcRenderer.invoke('data:save', data),
  importFile: () => ipcRenderer.invoke('file:import'),
  openFile: filePath => ipcRenderer.invoke('file:open', filePath),
  openJw: url => ipcRenderer.invoke('url:open', url),
  notify: (title, body) => ipcRenderer.invoke('reminder:notify', title, body)
});