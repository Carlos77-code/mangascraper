// electron-adapter.js
// Adaptador que permite download via diálogo nativo do Electron
// Inclua este script ANTES do app.js no index.html
// Não altera a interface, apenas o comportamento de download

(function() {
  'use strict';

  // Salvar referência original do fetch
  const originalFetch = window.fetch;

  // Intercepta chamadas para /download
  window.fetch = function(url, options) {
    // Se for uma requisição de download, usar Electron API
    if (typeof url === 'string' && url.includes('/download')) {
      return originalFetch(url, options).then(response => {
        // Se o response for ok, ler o buffer e usar diálogo nativo
        if (response.ok) {
          return response.arrayBuffer().then(arrayBuffer => {
            const filename = getFilenameFromResponse(response);
            // Envia para o processo principal via IPC
            if (window.electronAPI && window.electronAPI.savePDF) {
              return window.electronAPI.savePDF(
                Array.from(new Uint8Array(arrayBuffer)),
                filename
              ).then((result) => {
                if (result && result.success) {
                  // Cria um response fictício para manter compatibilidade
                  return new Response(null, { status: 200 });
                }
                throw new Error(result ? result.error : 'Falha ao salvar');
              });
            }
            // Fallback: usa comportamento padrão
            return new Response(null, { status: 200 });
          });
        }
        return response;
      });
    }

    // Para todas as outras requisições, usa o fetch original
    return originalFetch(url, options);
  };

  // Extrai o nome do arquivo do response header
  function getFilenameFromResponse(response) {
    const disposition = response.headers.get('content-disposition');
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) return match[1];
    }
    return 'manga.pdf';
  }
})();