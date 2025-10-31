import { navigateTo } from '../core/router.js';
import { state } from '../core/state.js';
import { 
  updateMusicStatus,
  setMusicVolume,
  toggleMusic,
  toggleSFX
} from '../core/audio.js';

export function renderConfigView(container) {
  const root = document.createElement('div');
  root.className = 'view page-enter';
  
  root.innerHTML = `
    <div class="config-shell">
      <header class="config-header">
        <button class="btn-back" id="btn-back">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <h1 class="config-title">Configurações</h1>
      </header>

      <main class="config-content">
        <!-- ÁUDIO -->
        <section class="config-section">
          <h2 class="section-title">🔊 Áudio</h2>
          
          <div class="config-group">
            <label class="config-label">Música de Fundo</label>
            <div class="config-control">
              <button 
                id="cfg-music-toggle" 
                class="toggle-switch ${state.config.audio.musicOn ? 'is-on' : ''}"
                aria-label="Ligar/Desligar Música"
              ></button>
            </div>
          </div>

          <div 
            id="cfg-volume-wrapper" 
            class="config-group"
            style="display: ${state.config.audio.musicOn ? 'block' : 'none'};"
          >
            <label class="config-label">Volume da Música</label>
            <div class="config-control">
              <input 
                type="range" 
                id="cfg-music-volume" 
                class="slider-field"
                min="0" max="1" step="0.05" 
                value="${state.config.audio.musicVolume}"
              />
              <div class="slider-value">${Math.round(state.config.audio.musicVolume * 100)}%</div>
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Efeitos Sonoros</label>
            <div class="config-control">
              <button 
                id="cfg-sfx-toggle" 
                class="toggle-switch ${state.config.audio.sfxOn ? 'is-on' : ''}"
                aria-label="Ligar/Desligar Efeitos Sonoros"
              ></button>
            </div>
          </div>
        </section>

        <!-- INTERFACE -->
        <section class="config-section">
          <h2 class="section-title">🎨 Interface</h2>
          
          <div class="config-group">
            <label class="config-label">Tema de Cores</label>
            <div class="config-control">
              <div class="theme-selector">
                <button class="theme-option" data-theme="desert">
                  <div class="theme-preview theme-preview-desert"></div>
                  <span class="theme-name">Deserto Árabe</span>
                </button>
                <button class="theme-option" data-theme="desert-night">
                  <div class="theme-preview theme-preview-desert-night"></div>
                  <span class="theme-name">Noite no Deserto</span>
                </button>
                <button class="theme-option" data-theme="halloween">
                  <div class="theme-preview theme-preview-halloween"></div>
                  <span class="theme-name">Halloween</span>
                </button>
                <button class="theme-option" data-theme="christmas">
                  <div class="theme-preview theme-preview-christmas"></div>
                  <span class="theme-name">Natal</span>
                </button>
              </div>
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Estilo das Peças</label>
            <div class="config-control">
              <select id="cfg-piece-style" class="select-field">
                <option value="modern">Moderno - Gradientes suaves</option>
                <option value="classic">Clássico - Cores sólidas</option>
                <option value="minimal">Minimalista - Sem efeitos</option>
              </select>
            </div>
          </div>
          
          <div class="config-group">
            <label class="config-label">Animações</label>
            <div class="config-control">
              <button 
                id="cfg-animations-toggle" 
                class="toggle-switch ${state.config.animations !== false ? 'is-on' : ''}"
                aria-label="Ligar/Desligar Animações"
              ></button>
              <p class="config-hint">Desativar para melhor performance</p>
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Mostrar Dicas Visuais</label>
            <div class="config-control">
              <button 
                id="cfg-hints-toggle" 
                class="toggle-switch ${state.config.showHints !== false ? 'is-on' : ''}"
                aria-label="Ligar/Desligar Dicas Visuais"
              ></button>
              <p class="config-hint">Destaque de jogadas possíveis</p>
            </div>
          </div>

          <div class="config-group">
            <label class="config-label">Velocidade das Animações</label>
            <div class="config-control">
              <select id="cfg-anim-speed" class="select-field">
                <option value="fast">Rápida</option>
                <option value="normal">Normal</option>
                <option value="slow">Lenta</option>
              </select>
            </div>
          </div>
        </section>

        <!-- AÇÕES -->
        <section class="config-section config-actions">
          <button class="btn btn-secondary btn-block" id="btn-reset-config">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
            Restaurar Padrões
          </button>
        </section>
      </main>
    </div>
  `;

  // ===== HANDLERS =====
  
  // Voltar
  root.querySelector('#btn-back').onclick = () => {
    root.classList.remove('page-enter');
    root.classList.add('page-leave');
    setTimeout(() => navigateTo('menu'), 180);
  };

  // Inicializa valor do select de velocidade de animação
  root.querySelector('#cfg-anim-speed').value = state.config.animSpeed || 'normal';
  root.querySelector('#cfg-piece-style').value = state.config.pieceStyle || 'modern';

  // Marca o tema ativo
  const currentTheme = state.config.theme || 'desert';
  document.body.dataset.theme = currentTheme;
  root.querySelectorAll('.theme-option').forEach(btn => {
    if (btn.dataset.theme === currentTheme) {
      btn.classList.add('is-active');
    }
  });

  // Áudio
  const musicToggle = root.querySelector('#cfg-music-toggle');
  const volumeWrapper = root.querySelector('#cfg-volume-wrapper');
  const volumeSlider = root.querySelector('#cfg-music-volume');
  const volumeValue = root.querySelector('.slider-value');

  musicToggle.onclick = () => {
    toggleMusic();
    musicToggle.classList.toggle('is-on', state.config.audio.musicOn);
    volumeWrapper.style.display = state.config.audio.musicOn ? 'block' : 'none';
  };

  volumeSlider.oninput = (e) => {
    const vol = parseFloat(e.target.value);
    setMusicVolume(vol);
    volumeValue.textContent = `${Math.round(vol * 100)}%`;
  };

  root.querySelector('#cfg-sfx-toggle').onclick = (e) => {
    toggleSFX();
    e.target.classList.toggle('is-on', state.config.audio.sfxOn);
  };

  // Interface - Temas
  root.querySelectorAll('.theme-option').forEach(btn => {
    btn.onclick = () => {
      const theme = btn.dataset.theme;
      state.config.theme = theme;
      document.body.dataset.theme = theme;
      
      // Atualiza visual do seletor
      root.querySelectorAll('.theme-option').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    };
  });

  // Interface - Estilo das peças
  root.querySelector('#cfg-piece-style').onchange = (e) => {
    state.config.pieceStyle = e.target.value;
    document.body.dataset.pieceStyle = e.target.value;
  };

  // Interface - Animações
  root.querySelector('#cfg-animations-toggle').onclick = (e) => {
    state.config.animations = !state.config.animations;
    e.target.classList.toggle('is-on', state.config.animations !== false);
    document.body.classList.toggle('no-animations', state.config.animations === false);
  };

  root.querySelector('#cfg-hints-toggle').onclick = (e) => {
    state.config.showHints = !state.config.showHints;
    e.target.classList.toggle('is-on', state.config.showHints !== false);
  };

  root.querySelector('#cfg-anim-speed').onchange = (e) => {
    state.config.animSpeed = e.target.value;
    document.body.dataset.animSpeed = e.target.value;
  };

  // Restaurar padrões
  root.querySelector('#btn-reset-config').onclick = () => {
    if (confirm('Restaurar todas as configurações para os valores padrão?')) {
      state.config = {
        columns: 9,
        mode: 'vs-computer',
        firstPlayer: 'human',
        aiLevel: 'easy',
        audio: {
          musicVolume: 0.3,
          musicOn: false,
          sfxOn: true
        },
        theme: 'desert',
        animations: true,
        showHints: true,
        animSpeed: 'normal',
        pieceStyle: 'modern'
      };
      
      // Aplica o tema padrão
      document.body.dataset.theme = 'desert';
      document.body.dataset.pieceStyle = 'modern';
      
      // Re-renderiza a view
      container.innerHTML = '';
      renderConfigView(container);
    }
  };

  // ===== ATALHOS DE TECLADO =====
  const handleKeyPress = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }
    
    if (e.key === 'Escape') {
      root.querySelector('#btn-back').click();
    }
  };

  document.addEventListener('keydown', handleKeyPress);

  // ⚡ PERFORMANCE: Cleanup
  window.cleanupConfigView = () => {
    document.removeEventListener('keydown', handleKeyPress);
  };

  container.appendChild(root);
}