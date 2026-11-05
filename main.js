const { app, BrowserWindow, ipcMain, dialog, shell, session } = require('electron');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let flaskProcess = null;
let flaskPort = 5001;
let window = null;

// Resolve o caminho do Python
function resolvePythonPath() {
  // Em packaged app, o python está em resources
  const appPath = app.getAppPath();
  const venvPython = 'D:\\\\carlo\\\\Projeto\\\\MangaScraper\\\\venv\\\\Scripts\\\\python.exe';
  const candidates = [
    venvPython,
    path.join(process.resourcesPath, 'python', 'python.exe'),
    path.join(appPath, 'python', 'python.exe'),
    'python',
    'python3',
    'py',
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) { console.log('[MangaScraper] Python found at', c); return c; }
    } catch {}
    // tenta executar --version para validar comando no PATH
    try {
      const result = spawnSync(c, ['--version'], { stdio: 'ignore', timeout: 2000 });
      if (result.status === 0 || result.error == null) { console.log('[MangaScraper] Python resolved via PATH:', c); return c; }
    } catch {}
  }
  console.warn('[MangaScraper] Python not found, fallback to python');
  return 'python';
}

// Verifica se uma porta está em uso
function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => { resolve(false); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.connect(port, host);
  });
}

// Aguarda o Flask estar respondendo
async function waitForFlask(port, maxRetries = 80) {
  for (let i = 0; i < maxRetries; i++) {
    if (await isPortOpen(port)) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

// Inicia o Flask como subprocesso
function startFlask() {
  const pythonPath = resolvePythonPath();
  const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked');
  const scriptPath = app.isPackaged
    ? path.join(unpackedPath, 'flask_wrapper.py')
    : path.join(__dirname, 'flask_wrapper.py');
  const workDir = app.isPackaged
    ? unpackedPath
    : __dirname;

  flaskProcess = spawn(pythonPath, [scriptPath], {
    env: (() => {
      const env = { ...process.env, FLASK_RUN_PORT: String(flaskPort) };
      delete env.HTTP_PROXY;
      delete env.HTTPS_PROXY;
      delete env.http_proxy;
      delete env.https_proxy;
      delete env.NO_PROXY;
      delete env.no_proxy;
      return env;
    })(),
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: workDir,
  });

  flaskProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.log('[Flask]', msg);
  });

  flaskProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.error('[Flask stderr]', msg);
  });

  flaskProcess.on('error', (err) => {
    dialog.showErrorBox('Falha ao iniciar Flask', err.message);
    app.quit();
  });

  flaskProcess.on('exit', (code) => {
    console.log('[Flask] Process exited with code', code);
  });
}

// Cria a janela do Electron
function createWindow() {
  window = new BrowserWindow({
    width: 420,
    height: 720,
    minWidth: 360,
    minHeight: 600,
    title: 'MangaScraper',
    backgroundColor: '#0D0D0D',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Carrega a URL do Flask
  window.loadURL(`http://127.0.0.1:${flaskPort}`);

  // Menu com opção de resolver Cloudflare
  const { Menu } = require('electron');
  const menuTemplate = [
    {
      label: 'Ferramentas',
      submenu: [
        {
          label: 'Resolver Cloudflare',
          click: async () => {
            const challengeWin = new BrowserWindow({
              width: 1200,
              height: 800,
              webPreferences: { sandbox: false }
            });
            challengeWin.loadURL('https://mangadex.org');
            challengeWin.setTitle('Resolva o Cloudflare - MangaScraper');
            challengeWin.on('closed', async () => {
              const unpackedPath = app.isPackaged
                ? path.join(process.resourcesPath, 'app.asar.unpacked')
                : __dirname;
              const cookiesFile = path.join(unpackedPath, 'cookies.json');
              try {
                const cookies = await session.defaultSession.cookies.get({ url: 'https://mangadex.org' });
                const cookieData = cookies.map(c => ({
                  name: c.name,
                  value: c.value,
                  domain: c.domain,
                  path: c.path
                }));
                fs.writeFileSync(cookiesFile, JSON.stringify(cookieData, null, 2));
                dialog.showMessageBox(window, { type: 'info', title: 'Cloudflare', message: `Cookies salvos: ${cookieData.length}` });
              } catch (err) {
                dialog.showErrorBox('Erro', err.message);
              }
            });
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Abre devtools em desenvolvimento
  if (process.argv.includes('--dev') || !app.isPackaged) {
    window.webContents.openDevTools();
  }

  window.on('closed', () => {
    window = null;
  });
}

// IPC: Salvar PDF via diálogo nativo
ipcMain.handle('save-pdf', async (event, { buffer, filename }) => {
  if (!window) return { success: false, error: 'No window' };

  const { canceled, filePath } = await dialog.showSaveDialog(window, {
    title: 'Salvar PDF',
    defaultPath: filename,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });

  if (canceled || !filePath) {
    return { success: false, canceled: true };
  }

  try {
    const buf = Buffer.from(buffer);
    fs.writeFileSync(filePath, buf);
    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: Mostrar erro
ipcMain.on('show-error', (event, { title, message }) => {
  dialog.showErrorBox(title, message);
});

// IPC: Abrir externamente
ipcMain.on('open-external', (event, { url }) => {
  shell.openExternal(url);
});

// IPC: Resolver Cloudflare manualmente
ipcMain.handle('open-cloudflare-challenge', async () => {
  const challengeWin = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { sandbox: false }
  });
  challengeWin.loadURL('https://mangadex.org');
  challengeWin.setTitle('Resolva o Cloudflare - MangaScraper');
  await new Promise(resolve => challengeWin.on('closed', resolve));
  
  const unpackedPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app.asar.unpacked')
    : __dirname;
  const cookiesFile = path.join(unpackedPath, 'cookies.json');
  
  try {
    const cookies = await session.defaultSession.cookies.get({ url: 'https://mangadex.org' });
    const cookieData = cookies.map(c => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path
    }));
    fs.writeFileSync(cookiesFile, JSON.stringify(cookieData, null, 2));
    return { success: true, cookiesCount: cookieData.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Inicialização
app.whenReady().then(async () => {
  // Determina a porta livre
  const server = net.createServer();
  server.listen(0, '127.0.0.1', async () => {
    flaskPort = server.address().port;
    server.close();
    startFlask();
    const ready = await waitForFlask(flaskPort);
    if (!ready) {
      dialog.showErrorBox('Falha ao iniciar Flask', 'O servidor Flask não respondeu na porta ' + flaskPort);
      app.quit();
      return;
    }
    createWindow();
  });
  server.on('error', async () => {
    // Fallback: usa porta padrão
    startFlask();
    const ready = await waitForFlask(flaskPort);
    if (!ready) {
      dialog.showErrorBox('Falha ao iniciar Flask', 'O servidor Flask não respondeu na porta ' + flaskPort);
      app.quit();
      return;
    }
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (flaskProcess) flaskProcess.kill();
  app.quit();
});

app.on('before-quit', () => {
  if (flaskProcess) flaskProcess.kill('SIGTERM');
});