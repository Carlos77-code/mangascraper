# MangaScraper - Script de Instalação (Windows)
# Execute como administrador para instalar dependências

Write-Host "=== MangaScraper - Instalador FAT32 ===" -ForegroundColor Cyan

# Verificar Python
try {
    $pythonVersion = python --version 2>$null
    Write-Host "[OK] Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Python nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Node.js nao encontrado" -ForegroundColor Red
    exit 1
}

# Criar ambiente virtual Python (sem symlinks para FAT32)
if (-not (Test-Path "venv")) {
    Write-Host "[INFO] Criando ambiente virtual Python..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao criar ambiente virtual" -ForegroundColor Red
        exit 1
    }
}

# Ativar ambiente virtual
Write-Host "[INFO] Ativando ambiente virtual..." -ForegroundColor Yellow
& venv\Scripts\activate.bat

# Atualizar pip
Write-Host "[INFO] Atualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Instalar dependências Python
Write-Host "[INFO] Instalando dependências Python..." -ForegroundColor Yellow
pip install -r requirements.txt

# Instalar dependências Node
Write-Host "[INFO] Instalando dependências Node..." -ForegroundColor Yellow
npm install

# Instalar electron-builder globalmente
Write-Host "[INFO] Instalando electron-builder..." -ForegroundColor Yellow
npm install -g electron-builder

Write-Host ""
Write-Host "=== Instalacao concluida! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o app:"
Write-Host "  npm start"
Write-Host ""
Write-Host "Para build de distribuicao:"
Write-Host "  npm run build"
Write-Host ""