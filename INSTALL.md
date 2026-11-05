# MangaScraper Desktop - Instalação

## Pré-requisitos

- Python 3.8+
- Node.js 18+
- Windows 10/11, macOS 11+, ou Linux (FAT32 compatível)

## Instalação Rápida (Windows)

### Opção 1: Script Automático

```powershell
# Execute no PowerShell (como Administrador)
.\install.ps1
```

### Opção 2: Manual

```powershell
# 1. Criar ambiente virtual Python (sem symlinks para FAT32)
python -m venv venv

# 2. Ativar ambiente virtual
venv\Scripts\activate.bat

# 3. Instalar dependências Python
pip install -r requirements.txt

# 4. Instalar dependências Node
npm install

# 5. Instalar electron-builder (para builds)
npm install -g electron-builder
```

## Iniciar o App

```bash
npm start
```

O Electron inicia automaticamente o Flask em background e abre a interface.

## Build para Distribuição

```bash
# Windows
npm run build -- --win

# macOS
npm run build -- --mac

# Linux
npm run build -- --linux
```

Os arquivos gerados ficam na pasta `dist/`.

## Solução de Problemas

### FAT32 - Erro de symlinks

Se estiver usando disco FAT32 e o Electron falhar na build:

```bash
# Use electron-packager em vez de electron-builder
npx electron-packager . MangaScraper --platform=win --arch=x64 --overwrite
```

### Python não encontrado

Certifique-se de que o Python está no PATH do sistema.

### Node.js não encontrado

Instale Node.js 18+ de https://nodejs.org