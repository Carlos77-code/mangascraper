# MangaScraper Desktop

Versão desktop do MangaScraper usando Electron como shell para o app Flask existente.

## Estrutura

- `main.js` — Processo principal do Electron, inicia o Flask em background
- `preload.js` — Bridge seguro para a interface web
- `package.json` — Configuração do Electron e builds
- `app.py` — Servidor Flask (não modificado)
- `scraper.py` — Lógica de scraping (não modificado)
- `ui/` — Interface web existente (não modificada)

## Como executar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar
npm start
```

O Electron inicia automaticamente o Flask na porta 5001 e carrega a interface.

### Build para distribuição

```bash
# Instalar electron-builder globalmente (opcional)
npm install -g electron-builder

# Build para Windows, macOS e Linux
npm run build
```

Os arquivos gerados ficam em `dist/`.

## Funcionamento

1. O Electron inicia o subprocesso Flask (`app.py`)
2. Aguarda o Flask estar respondendo na porta
3. Carrega a interface web em uma janela nativa
4. O download de PDFs funciona via diálogo nativo do sistema

## Dependências

- Python 3.8+
- Node.js 18+
- Flask, requests, Pillow, beautifulsoup4 (via requirements.txt)