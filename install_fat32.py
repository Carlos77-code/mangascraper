# -*- coding: utf-8 -*-
"""
MangaScraper - Instalador FAT32 compatível
Instala dependências sem criar symlinks (problema comum em FAT32)
"""
import os
import sys
import subprocess
import venv
import shutil

def run(cmd, cwd=None):
    """Executa comando e exibe output"""
    print(f"[RUN] {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(f"[WARN] {result.stderr}")
    return result.returncode

def main():
    print("=" * 50)
    print("MangaScraper - Instalador (FAT32 compatível)")
    print("=" * 50)

    # Verificar Python
    if sys.version_info < (3, 8):
        print("[ERRO] Python 3.8+ necessário")
        input("Pressione Enter para sair...")
        return 1

    # Verificar Node.js
    rc = run("node --version")
    if rc != 0:
        print("[ERRO] Node.js não encontrado. Instale de https://nodejs.org")
        input("Pressione Enter para sair...")
        return 1

    print("[OK] Python e Node.js encontrados")

    # Criar ambiente virtual Python (sem symlinks)
    venv_dir = os.path.join(os.getcwd(), "venv")
    if not os.path.exists(venv_dir):
        print("[INFO] Criando ambiente virtual Python...")
        venv.create(venv_dir, with_pip=True, symlinks=False)

    # Ativar ambiente virtual
    python_exe = os.path.join(venv_dir, "Scripts", "python.exe")
    pip_exe = os.path.join(venv_dir, "Scripts", "pip.exe")

    if not os.path.exists(python_exe):
        print("[ERRO] Falha ao criar ambiente virtual")
        input("Pressione Enter para sair...")
        return 1

    # Atualizar pip
    print("[INFO] Atualizando pip...")
    run(f'"{python_exe}" -m pip install --upgrade pip')

    # Instalar dependências Python
    print("[INFO] Instalando dependências Python...")
    rc = run(f'"{pip_exe}" install -r requirements.txt')
    if rc != 0:
        print("[AVISO] Algumas dependências Python falharam")

    # Instalar dependências Node
    print("[INFO] Instalando dependências Node...")
    rc = run("npm install")
    if rc != 0:
        print("[AVISO] npm install falhou")

    # Instalar electron-builder
    print("[INFO] Instalando electron-builder...")
    rc = run("npm install -g electron-builder")

    print()
    print("=" * 50)
    print("Instalação concluída!")
    print()
    print("Para iniciar o app:")
    print("  npm start")
    print()
    print("Para build de distribuição:")
    print("  npm run build")
    print("=" * 50)

    input("Pressione Enter para sair...")
    return 0

if __name__ == "__main__":
    sys.exit(main())