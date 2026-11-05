// preload.js - Bridge seguro entre Electron e a UI web
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Salvar PDF via diálogo nativo (usa handle para assíncrono)
  savePDF: (buffer, filename) => ipcRenderer.invoke('save-pdf', { buffer, filename }),

  // Mostrar erro
  showError: (title, message) => ipcRenderer.send('show-error', { title, message }),

  // Abrir URL externamente
  openExternal: (url) => ipcRenderer.send('open-external', { url }),

  // Resolver Cloudflare manualmente
  resolveCloudflare: () => ipcRenderer.invoke('open-cloudflare-challenge'),
});