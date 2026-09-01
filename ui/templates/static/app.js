// static/app.js - Manga-Reader Focused Design

(function() {
  'use strict';

  // ============ STATE ============
  const state = {
    isProcessing: false,
    pollingInterval: null,
    currentTheme: 'dark',
    highContrast: false,
    downloadedPages: 0,
    totalPages: 0
  };

  // ============ DOM ELEMENTS ============
  const els = {
    // Theme
    themeToggle: document.getElementById('themeToggle'),
    themeIconSun: document.getElementById('themeIconSun'),
    themeIconMoon: document.getElementById('themeIconMoon'),
    contrastToggle: document.getElementById('contrastToggle'),

    // Chapter card
    chapterTitle: document.getElementById('chapterTitle'),
    chapterBadge: document.getElementById('chapterBadge'),
    metaManga: document.getElementById('metaManga'),
    metaChapter: document.getElementById('metaChapter'),

    // Form
    urlInput: document.getElementById('url'),
    nameInput: document.getElementById('name'),
    chapterInput: document.getElementById('chapter'),
    startButton: document.getElementById('startButton'),
    urlError: document.getElementById('urlError'),
    nameError: document.getElementById('nameError'),
    chapterError: document.getElementById('chapterError'),

    // Progress
    progressSection: document.getElementById('progressSection'),
    progressBar: document.getElementById('progressBar'),
    progressPercent: document.getElementById('progressPercent'),
    progressBarContainer: document.querySelector('.progress-bar-container'),
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    thumbnails: document.getElementById('thumbnails'),
    statusMessage: document.getElementById('statusMessage'),
    statusText: document.getElementById('statusText'),

    // Toast
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toastIcon'),
    toastText: document.getElementById('toastText'),

    // Live region
    liveRegion: document.getElementById('liveRegion')
  };

  // ============ UTILITIES ============
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function announce(message, priority = 'polite') {
    els.liveRegion.setAttribute('aria-live', priority);
    els.liveRegion.textContent = message;
  }

  function showToast(message, type = 'info') {
    els.toastText.textContent = message;
    els.toast.className = 'toast show ' + type;
    els.toast.hidden = false;

    if (type === 'success') {
      els.toastIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'error') {
      els.toastIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      els.toastIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
    }

    setTimeout(() => hideToast(), 4000);
  }

  function hideToast() {
    els.toast.classList.remove('show');
    setTimeout(() => { els.toast.hidden = true; }, 300);
  }

  function vibrate(pattern = [50]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  function setFieldError(input, errorEl, message) {
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
    input.focus({ preventScroll: true });
  }

  function clearFieldError(input, errorEl) {
    input.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  }

  function clearAllErrors() {
    [els.urlInput, els.nameInput, els.chapterInput].forEach(input => {
      input.removeAttribute('aria-invalid');
    });
    [els.urlError, els.nameError, els.chapterError].forEach(el => el.textContent = '');
  }

  // ============ THEME MANAGEMENT ============
  function applyTheme(theme, highContrast) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-high-contrast', highContrast);
    els.themeIconSun.style.display = theme === 'light' ? 'block' : 'none';
    els.themeIconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    els.themeToggle.setAttribute('aria-pressed', theme === 'dark');
    els.contrastToggle.setAttribute('aria-pressed', highContrast);
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('mangascraper-theme');
    const savedContrast = localStorage.getItem('mangascraper-contrast');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    state.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    state.highContrast = savedContrast === 'true';

    applyTheme(state.currentTheme, state.highContrast);
  }

  function toggleTheme() {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mangascraper-theme', state.currentTheme);
    applyTheme(state.currentTheme, state.highContrast);
    announce(state.currentTheme === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado');
  }

  function toggleContrast() {
    state.highContrast = !state.highContrast;
    localStorage.setItem('mangascraper-contrast', state.highContrast);
    applyTheme(state.currentTheme, state.highContrast);
    announce(state.highContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
  }

  // ============ CHAPTER CARD UPDATE ============
  function updateChapterCard(url, name, chapter) {
    if (url) {
      const match = url.match(/chapter\/([a-f0-9-]+)/i);
      if (match) {
        els.chapterTitle.textContent = name || 'Carregando...';
        els.chapterBadge.textContent = `Cap. ${chapter}`;
        els.metaManga.textContent = name || '—';
        els.metaChapter.textContent = chapter || '—';
      }
    }
  }

  // ============ PROGRESS UI ============
  function resetProgressUI() {
    state.downloadedPages = 0;
    state.totalPages = 0;

    els.progressSection.hidden = false;
    els.progressBar.style.width = '0%';
    els.progressBarContainer.setAttribute('aria-valuenow', '0');
    els.progressPercent.textContent = '0%';

    // Reset steps
    [els.step1, els.step2, els.step3].forEach((step, i) => {
      step.className = 'step' + (i === 0 ? ' active' : '');
    });

    // Clear thumbnails
    els.thumbnails.innerHTML = '';

    // Reset status
    els.statusMessage.className = 'status-message';
    els.statusText.textContent = 'Iniciando...';
  }

  function updateStep(stepNum, status) {
    // status: 'active', 'complete'
    const steps = [els.step1, els.step2, els.step3];
    steps.forEach((step, i) => {
      step.className = 'step';
      if (i + 1 < stepNum) step.classList.add('complete');
      else if (i + 1 === stepNum) step.classList.add(status);
    });
  }

  function updateProgress(progress, message, pagesInfo = null) {
    els.progressBar.style.width = progress + '%';
    els.progressBarContainer.setAttribute('aria-valuenow', progress);
    els.progressPercent.textContent = Math.round(progress) + '%';

    if (message) {
      els.statusText.textContent = message;
    }

    if (pagesInfo) {
      const { current, total } = pagesInfo;
      state.downloadedPages = current;
      state.totalPages = total;
      renderThumbnails(current, total);
    }

    // Update steps based on progress
    if (progress < 30) updateStep(1, 'active');
    else if (progress < 85) updateStep(2, 'active');
    else updateStep(3, 'active');
  }

  function renderThumbnails(current, total) {
    if (total <= 0) return;

    // Create skeleton thumbnails if not exist
    if (els.thumbnails.children.length === 0) {
      for (let i = 1; i <= total; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.setAttribute('role', 'listitem');
        thumb.setAttribute('aria-label', `Página ${i} de ${total}`);
        thumb.innerHTML = `
          <div class="thumbnail-skeleton" aria-hidden="true"></div>
          <span class="thumbnail-number">${i}</span>
        `;
        els.thumbnails.appendChild(thumb);
      }
    }

    // Update loaded thumbnails (we don't have actual images, so just mark as loaded)
    const thumbs = els.thumbnails.querySelectorAll('.thumbnail');
    thumbs.forEach((thumb, i) => {
      if (i < current) {
        thumb.classList.add('loaded');
        // Replace skeleton with a placeholder "loaded" state
        const skeleton = thumb.querySelector('.thumbnail-skeleton');
        if (skeleton) {
          skeleton.style.background = 'linear-gradient(135deg, var(--color-success-muted), var(--color-accent-muted))';
        }
      }
    });
  }

  function setProgressComplete(success, message) {
    if (success) {
      els.progressBar.style.width = '100%';
      els.progressBarContainer.setAttribute('aria-valuenow', '100');
      els.progressPercent.textContent = '100%';
      [els.step1, els.step2, els.step3].forEach(s => s.className = 'step complete');
      els.statusMessage.className = 'status-message success';
      els.statusText.textContent = message || 'PDF gerado com sucesso!';
      announce('PDF gerado com sucesso. Iniciando download.', 'assertive');
      vibrate([100, 50, 100]);
    } else {
      els.statusMessage.className = 'status-message error';
      els.statusText.textContent = message || 'Erro ao gerar PDF';
      announce('Erro: ' + (message || 'Falha ao gerar PDF'), 'assertive');
      vibrate([200, 100, 200]);
    }
  }

  // ============ FORM VALIDATION ============
  function validateForm() {
    clearAllErrors();
    let valid = true;

    const url = els.urlInput.value.trim();
    if (!url) {
      setFieldError(els.urlInput, els.urlError, 'Insira a URL do capítulo');
      valid = false;
    } else if (!url.includes('mangadex.org')) {
      setFieldError(els.urlInput, els.urlError, 'Apenas URLs do MangaDex são suportadas');
      valid = false;
    }

    const name = els.nameInput.value.trim();
    if (!name) {
      setFieldError(els.nameInput, els.nameError, 'Insira o nome do mangá');
      valid = false;
    }

    const chapter = els.chapterInput.value.trim();
    if (!chapter) {
      setFieldError(els.chapterInput, els.chapterError, 'Insira o número do capítulo');
      valid = false;
    } else {
      const num = parseInt(chapter, 10);
      if (!Number.isFinite(num) || num <= 0) {
        setFieldError(els.chapterInput, els.chapterError, 'Número de capítulo inválido');
        valid = false;
      }
    }

    return valid;
  }

  // ============ API CALLS ============
  async function startProcess(url, name, chapter) {
    const response = await fetch('/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, name, chapter })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Falha ao iniciar o processo');
    }
    return data;
  }

  function pollStatus() {
    if (state.pollingInterval) clearInterval(state.pollingInterval);

    state.pollingInterval = setInterval(async () => {
      try {
        const res = await fetch('/status');
        const data = await res.json();

        updateProgress(data.progress, data.message, data.pages);

        if (data.state === 'COMPLETED') {
          stopPolling();
          setProgressComplete(true, data.message);
          triggerDownload();
        } else if (data.state === 'ERROR') {
          stopPolling();
          setProgressComplete(false, data.message);
          els.startButton.disabled = false;
          els.startButton.classList.remove('loading');
          state.isProcessing = false;
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1500);
  }

  function stopPolling() {
    if (state.pollingInterval) {
      clearInterval(state.pollingInterval);
      state.pollingInterval = null;
    }
  }

  function triggerDownload() {
    window.location.href = '/download';

    // Reset UI after a delay
    setTimeout(() => {
      els.startButton.disabled = false;
      els.startButton.classList.remove('loading');
      state.isProcessing = false;
      // Keep progress visible for a bit
      setTimeout(() => {
        els.progressSection.hidden = true;
      }, 5000);
    }, 1000);
  }

  // ============ EVENT HANDLERS ============
  async function handleStart() {
    if (state.isProcessing) return;

    if (!validateForm()) {
      vibrate([50, 50, 50]);
      showToast('Preencha todos os campos corretamente', 'error');
      return;
    }

    vibrate([30]);
    state.isProcessing = true;
    els.startButton.disabled = true;
    els.startButton.classList.add('loading');
    clearAllErrors();

    const url = els.urlInput.value.trim();
    const name = els.nameInput.value.trim();
    const chapter = parseInt(els.chapterInput.value.trim(), 10);

    updateChapterCard(url, name, chapter);
    resetProgressUI();

    try {
      await startProcess(url, name, chapter);
      updateProgress(5, 'Conectando ao MangaDex...');
      pollStatus();
    } catch (err) {
      state.isProcessing = false;
      els.startButton.disabled = false;
      els.startButton.classList.remove('loading');
      els.progressSection.hidden = true;
      showToast(err.message, 'error');
      announce('Erro: ' + err.message, 'assertive');
    }
  }

  function handleInputChange() {
    const hasUrl = els.urlInput.value.trim().length > 0;
    const hasName = els.nameInput.value.trim().length > 0;
    const hasChapter = els.chapterInput.value.trim().length > 0;

    els.startButton.disabled = !(hasUrl && hasName && hasChapter) || state.isProcessing;

    if (hasUrl) {
      updateChapterCard(els.urlInput.value.trim(), els.nameInput.value.trim(), els.chapterInput.value.trim());
    }
  }

  // ============ INITIALIZATION ============
  function init() {
    // Load theme
    loadTheme();

    // Theme toggle
    els.themeToggle.addEventListener('click', toggleTheme);
    els.contrastToggle.addEventListener('click', toggleContrast);

    // Form events
    els.startButton.addEventListener('click', handleStart);
    [els.urlInput, els.nameInput, els.chapterInput].forEach(input => {
      input.addEventListener('input', handleInputChange);
      input.addEventListener('blur', () => {
        if (input.value.trim() && input.hasAttribute('aria-invalid')) {
          clearFieldError(input, document.getElementById(input.id + 'Error'));
        }
      });
    });

    // Enter key on inputs
    [els.urlInput, els.nameInput, els.chapterInput].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !state.isProcessing) {
          handleStart();
        }
      });
    });

    // Paste handling for URL
    els.urlInput.addEventListener('paste', () => {
      setTimeout(handleInputChange, 0);
    });

    // Focus first input on load
    els.urlInput.focus({ preventScroll: true });

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('mangascraper-theme')) {
        state.currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(state.currentTheme, state.highContrast);
      }
    });

    // Reduced motion listener
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    });

    announce('MangaScraper carregado. Pronto para baixar capítulos.');
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();