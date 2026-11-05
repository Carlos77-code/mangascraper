# MangaScraper - Build Script (FAT32 compatível)
# Este script empacota o app Electron sem usar symlinks

param(
    [string]$Platform = "win"
)

Write-Host "=== MangaScraper Build ===" -ForegroundColor Cyan

# Verificar se node está disponível
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js não encontrado. Instale de https://nodejs.org"
    exit 1
}

# Verificar se python está disponível
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python não encontrado. Instale de https://python.org"
    exit 1
}

# Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências Node..." -ForegroundColor Yellow
    npm install
}

# Criar ambiente virtual Python se não existir
if (-not (Test-Path "venv")) {
    Write-Host "Criando ambiente virtual Python..." -ForegroundColor Yellow
    python -m venv venv
    & venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r requirements.txt
} else {
    & venv\Scripts\activate.bat
}

# Criar diretório de saída
$outputDir = "dist"
if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}
New-Item -ItemType Directory -Path $outputDir | Out-Null

# Empacotar com electron-builder (evita symlinks)
Write-Host "Empacotando para $Platform..." -ForegroundColor Yellow

$buildArgs = @(
    "build",
    "--$Platform",
    "--dir"  # Modo develop, sem instalar
)

try {
    npx electron-builder @buildArgs
} catch {
    Write-Host "Tentando alternativa com electron-packager..." -ForegroundColor Yellow
    
    # Fallback: usar electron-packager (mais simples, sem symlinks)
    npx electron-packager . MangaScraper --platform=win --arch=x64 --out=$outputDir --overwrite
}

Write-Host "Build concluído! Verifique a pasta $outputDir" -ForegroundColor Green