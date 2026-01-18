// Atualização do app.js para suportar o novo design
let isProcessing = false;

function start() {
    if (isProcessing) return;
    
    const urlInput = document.getElementById('url');
    const nameInput = document.getElementById('name');
    const chapterInput = document.getElementById('chapter');
    const startButton = document.getElementById('startButton');
    const statusElement = document.getElementById('status');
    const progressElement = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');
    
    // Validação dos campos
    if (!urlInput.value.trim()) {
        showStatus('Por favor, insira a URL do capítulo.', 'error');
        return;
    }

    // Only MangaDex supported
    if (!urlInput.value.includes('mangadex.org')) {
        showStatus('Apenas URLs do MangaDex (mangadex.org) são suportadas.', 'error');
        return;
    }
    
    if (!nameInput.value.trim()) {
        showStatus('Por favor, insira o nome do mangá.', 'error');
        return;
    }
    
    if (!chapterInput.value.trim()) {
        showStatus('Por favor, insira o número do capítulo.', 'error');
        return;
    }

    const chapterNumber = parseInt(chapterInput.value.trim(), 10);
    if (!Number.isFinite(chapterNumber) || chapterNumber <= 0) {
        showStatus('Por favor, insira um número de capítulo válido.', 'error');
        return;
    }
    
    // Preparar para processamento
    isProcessing = true;
    startButton.disabled = true;
    startButton.textContent = 'Processando...';
    startButton.classList.add('loading');
    
    // Resetar status
    statusElement.textContent = 'Iniciando download...';
    statusElement.className = 'status-message';
    progressElement.value = 0;
    progressText.textContent = '0%';
    
    fetch("/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            url: urlInput.value.trim(),
            name: nameInput.value.trim(),
            chapter: chapterNumber
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.started) {
            poll();
        } else {
            throw new Error('Falha ao iniciar o processo.');
        }
    })
    .catch(error => {
        showStatus(`Erro: ${error.message}`, 'error');
        resetButton();
    });
}

function poll() {
    const timer = setInterval(async () => {
        try {
            const res = await fetch("/status");
            const data = await res.json();
            
            updateProgress(data.progress, data.message);
            
            if (data.state === "COMPLETED") {
                showStatus('✅ PDF gerado com sucesso!', 'success');
                clearInterval(timer);
                resetButton();
            } else if (data.state === "ERROR") {
                showStatus(`❌ Erro: ${data.message}`, 'error');
                clearInterval(timer);
                resetButton();
            }
        } catch (error) {
            showStatus(`❌ Erro de conexão: ${error.message}`, 'error');
            clearInterval(timer);
            resetButton();
        }
    }, 1000);
}

function updateProgress(progress, message) {
    const progressElement = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');
    const statusElement = document.getElementById('status');
    
    progressElement.value = progress;
    progressText.textContent = `${Math.round(progress)}%`;
    statusElement.textContent = message;
    
    // Atualizar classes baseadas no estado
    if (message.includes('sucesso')) {
        statusElement.className = 'status-message success';
    } else if (message.includes('Erro') || message.includes('error')) {
        statusElement.className = 'status-message error';
    } else {
        statusElement.className = 'status-message';
    }
}

function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
}

function resetButton() {
    const startButton = document.getElementById('startButton');
    startButton.disabled = false;
    startButton.textContent = '📥 Download & Gerar PDF';
    startButton.classList.remove('loading');
    isProcessing = false;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', start);
});

if (Notification.permission === "granted") {
    new Notification("MangaScraper", {
        body: "Seu PDF está pronto para download!",
        icon: "/static/icon.png"
    });
}
