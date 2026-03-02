// // Atualização do app.js para suportar o novo design
// let isProcessing = false;

// function start() {
//     if (isProcessing) return;
    
//     const urlInput = document.getElementById('url');
//     const nameInput = document.getElementById('name');
//     const chapterInput = document.getElementById('chapter');
//     const startButton = document.getElementById('startButton');
//     const statusElement = document.getElementById('status');
//     const progressElement = document.getElementById('progress');
//     const progressText = document.getElementById('progress-text');
    
//     // Validação dos campos
//     if (!urlInput.value.trim()) {
//         showStatus('Por favor, insira a URL do capítulo.', 'error');
//         return;
//     }

//     // Only MangaDex supported
//     if (!urlInput.value.includes('mangadex.org')) {
//         showStatus('Apenas URLs do MangaDex (mangadex.org) são suportadas.', 'error');
//         return;
//     }
    
//     if (!nameInput.value.trim()) {
//         showStatus('Por favor, insira o nome do mangá.', 'error');
//         return;
//     }
    
//     if (!chapterInput.value.trim()) {
//         showStatus('Por favor, insira o número do capítulo.', 'error');
//         return;
//     }

//     const chapterNumber = parseInt(chapterInput.value.trim(), 10);
//     if (!Number.isFinite(chapterNumber) || chapterNumber <= 0) {
//         showStatus('Por favor, insira um número de capítulo válido.', 'error');
//         return;
//     }
    
//     // Preparar para processamento
//     isProcessing = true;
//     startButton.disabled = true;
//     startButton.textContent = 'Processando...';
//     startButton.classList.add('loading');
    
//     // Resetar status
//     statusElement.textContent = 'Iniciando download...';
//     statusElement.className = 'status-message';
//     progressElement.value = 0;
//     progressText.textContent = '0%';
    
//     fetch("/start", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({
//             url: urlInput.value.trim(),
//             name: nameInput.value.trim(),
//             chapter: chapterNumber
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.started) {
//             poll();
//         } else {
//             throw new Error('Falha ao iniciar o processo.');
//         }
//     })
//     .catch(error => {
//         showStatus(`Erro: ${error.message}`, 'error');
//         resetButton();
//     });
// }

// function poll() {
//     const timer = setInterval(async () => {
//         try {
//             const res = await fetch("/status");
//             const data = await res.json();
            
//             updateProgress(data.progress, data.message);
            
//             if (data.state === "COMPLETED") {
//                 showStatus('✅ PDF gerado com sucesso!', 'success');
//                 clearInterval(timer);
//                 resetButton();
//             } else if (data.state === "ERROR") {
//                 showStatus(`❌ Erro: ${data.message}`, 'error');
//                 clearInterval(timer);
//                 resetButton();
//             }
//         } catch (error) {
//             showStatus(`❌ Erro de conexão: ${error.message}`, 'error');
//             clearInterval(timer);
//             resetButton();
//         }
//     }, 1000);
// }

// function updateProgress(progress, message) {
//     const progressElement = document.getElementById('progress');
//     const progressText = document.getElementById('progress-text');
//     const statusElement = document.getElementById('status');
    
//     progressElement.value = progress;
//     progressText.textContent = `${Math.round(progress)}%`;
//     statusElement.textContent = message;
    
//     // Atualizar classes baseadas no estado
//     if (message.includes('sucesso')) {
//         statusElement.className = 'status-message success';
//     } else if (message.includes('Erro') || message.includes('error')) {
//         statusElement.className = 'status-message error';
//     } else {
//         statusElement.className = 'status-message';
//     }
// }

// function showStatus(message, type = 'info') {
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = message;
//     statusElement.className = `status-message ${type}`;
// }

// function resetButton() {
//     const startButton = document.getElementById('startButton');
//     startButton.disabled = false;
//     startButton.textContent = '📥 Download & Gerar PDF';
//     startButton.classList.remove('loading');
//     isProcessing = false;
// }

// // Inicialização
// document.addEventListener('DOMContentLoaded', function() {
//     const startButton = document.getElementById('startButton');
//     startButton.addEventListener('click', start);
// });

// if (Notification.permission === "granted") {
//     new Notification("MangaScraper", {
//         body: "Seu PDF está pronto para download!",
//         icon: "/static/icon.png"
//     });
// }


// static/app.js

let pollingInterval = null;
let isProcessing = false;

// Elementos da UI
const elements = {
    startBtn: document.getElementById('startButton'),
    urlInput: document.getElementById('url'),
    nameInput: document.getElementById('name'),
    chapterInput: document.getElementById('chapter'),
    progressBar: document.getElementById('progress'),
    progressText: document.getElementById('progress-text'),
    statusMsg: document.getElementById('status')
};

document.addEventListener('DOMContentLoaded', () => {
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', handleStart);
    }
});

async function handleStart() {
    if (isProcessing) return;
    
    const url = elements.urlInput?.value.trim();
    const name = elements.nameInput?.value.trim();
    const chapter = elements.chapterInput?.value.trim();
    
    if (!url || !name || !chapter) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    if (!url.includes('mangadex.org')) {
        alert('Apenas URLs do MangaDex são suportadas!');
        return;
    }
    
    try {
        await startProcess(url, name, parseInt(chapter));
    } catch (err) {
        alert('Erro: ' + err.message);
    }
}

async function startProcess(url, name, chapter) {
    resetUI();
    isProcessing = true;
    
    if (elements.startBtn) elements.startBtn.disabled = true;
    
    const response = await fetch('/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name, chapter })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Falha ao iniciar');
    }
    
    updateStatus('Iniciando scraping...', 0);
    startPolling();
}

function startPolling() {
    if (pollingInterval) clearInterval(pollingInterval);
    
    pollingInterval = setInterval(async () => {
        try {
            const res = await fetch('/status');
            const data = await res.json();
            
            updateStatus(data.message, data.progress);
            
            if (data.state === 'COMPLETED') {
                stopPolling();
                triggerDownload(); // <--- AQUI: Aciona o download automaticamente
            } else if (data.state === 'ERROR') {
                stopPolling();
                alert('Erro: ' + data.message);
            }
        } catch (err) {
            console.error('Erro no polling:', err);
        }
    }, 2000);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

function updateStatus(message, progress) {
    if (elements.statusMsg) elements.statusMsg.textContent = message;
    if (elements.progressBar) elements.progressBar.value = progress;
    if (elements.progressText) elements.progressText.textContent = progress + '%';
}

function triggerDownload() {
    console.log('[DOWNLOAD] Iniciando download...');
    // Redireciona para o endpoint de download, forçando o navegador a baixar
    window.location.href = '/download';
    
    // Reseta UI após iniciar download
    if (elements.startBtn) elements.startBtn.disabled = false;
    isProcessing = false;
}

function resetUI() {
    stopPolling();
    isProcessing = false;
    
    if (elements.progressBar) elements.progressBar.value = 0;
    if (elements.progressText) elements.progressText.textContent = '0%';
    if (elements.statusMsg) elements.statusMsg.textContent = 'Pronto para começar';
    if (elements.startBtn) elements.startBtn.disabled = false;
}