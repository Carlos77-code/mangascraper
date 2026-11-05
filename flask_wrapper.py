# -*- coding: utf-8 -*-
"""
Flask wrapper para Electron
Inicia o Flask e garante que a interface funcione no Electron
"""
import os
import sys

# Adiciona o diretório atual ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configura a porta via variável de ambiente
port = int(os.environ.get('FLASK_RUN_PORT', '5001'))

# Importa o app Flask existente
from app import app

if __name__ == '__main__':
    app.run(
        host='127.0.0.1',
        port=port,
        debug=False,
        use_reloader=False,
        threaded=True
    )