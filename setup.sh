#!/bin/bash
# MangaScraper - Instalador de Dependencias (Linux/macOS)
# Execute: bash setup.sh

set -e

echo "=== MangaScraper - Configurando Ambiente ==="

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "[ERRO] Python 3 nao encontrado. Instale de https://python.org"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js nao encontrado. Instale de https://nodejs.org"
    exit 1
fi

echo "[OK] Python e Node.js encontrados"

# Criar ambiente virtual Python
if [ ! -d "venv" ]; then
    echo "[INFO] Criando ambiente virtual Python..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "[INFO] Ativando ambiente virtual..."
source venv/bin/activate

# Atualizar pip
echo "[INFO] Atualizando pip..."
python -m pip install --upgrade pip

# Instalar dependencias Python
echo "[INFO] Instalando dependencias Python..."
pip install -r requirements.txt

# Instalar dependencias Node
echo "[INFO] Instalando dependencias Node..."
npm install

# Instalar electron-builder globalmente
echo "[INFO] Instalando electron-builder..."
npm install -g electron-builder

echo ""
echo "=== Configuracao Concluida ==="
echo ""
echo "Para iniciar o app:"
echo "  npm start"
echo ""
echo "Para build de distribuicao:"
echo "  npm run build"
echo ""