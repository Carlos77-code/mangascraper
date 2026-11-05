@echo off
REM MangaScraper - Instalador Simples (FAT32 compatível)
REM Execute como Administrador

echo === MangaScraper - Instalador ===

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado. Instale Python 3.8+ de https://python.org
    pause
    exit /b 1
)

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado. Instale Node.js 18+ de https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Python e Node.js encontrados

REM Criar ambiente virtual Python sem symlinks
if not exist venv (
    echo [INFO] Criando ambiente virtual Python...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao criar ambiente virtual
        pause
        exit /b 1
    )
)

REM Ativar ambiente virtual
echo [INFO] Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Atualizar pip
echo [INFO] Atualizando pip...
python -m pip install --upgrade pip

REM Instalar dependências Python
echo [INFO] Instalando dependências Python...
pip install -r requirements.txt

REM Instalar dependências Node
echo [INFO] Instalando dependências Node...
npm install

REM Instalar electron-builder globalmente
echo [INFO] Instalando electron-builder...
npm install -g electron-builder

echo.
echo === Instalacao concluida! ===
echo.
echo Para iniciar o app:
echo   npm start
echo.
echo Para build de distribuicao:
echo   npm run build
echo.
pause