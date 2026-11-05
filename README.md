# MangaScraper

Baixe capítulos de mangá do MangaDex e converta em PDF.

## Modo Desktop (Electron)

O MangaScraper pode ser executado como aplicativo desktop usando Electron como shell para o Flask existente.

### Estrutura

- `main.js` — Processo principal do Electron, inicia o Flask em background
- `preload.js` — Bridge seguro para a interface web
- `package.json` — Configuração do Electron e builds
- `flask_wrapper.py` — Wrapper do Flask para Electron
- `app.py` — Servidor Flask (não modificado)
- `scraper.py` — Lógica de scraping (não modificado)
- `ui/` — Interface web existente (não modificada)

### Instalação

```bash
# Instalar dependências Node
npm install

# Iniciar
npm start
```

### Build para Distribuição
```bash
# Windows
npm run build:win
```

```bash
# Windows, macOS e Linux
npm run build
```

## Modo Web (Flask)

```bash
pip install -r requirements.txt
python app.py
# Acesse http://127.0.0.1:5001
```

## Modo CLI

```bash
python Ink2PDF.py
```

## Solução de Problemas

### FAT32 - Erro de symlinks

Se estiver usando disco FAT32:

```bash
# Use electron-packager em vez de electron-builder
npx electron-packager . MangaScraper --platform=win --arch=x64 --overwrite
```

### Python não encontrado

Certifique-se de que o Python está no PATH do sistema.

### Node.js não encontrado

Instale Node.js 18+ de https://nodejs.org