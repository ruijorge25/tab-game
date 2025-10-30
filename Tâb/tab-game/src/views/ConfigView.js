import { navigateTo } from '../core/router.js';

export function renderConfigView(container) {
  const root = document.createElement('div');
  root.className = 'view config-view';
  root.innerHTML = `
    <section class="panel">
      <h1>Configuração</h1>
      <p>Esta é uma placeholder da Config View.</p>
      <div style="margin-top:16px; display:flex; gap:8px;">
        <button class="btn-primary" id="to-game">Ir para o Jogo</button>
        <button class="btn-secondary" id="to-menu">Voltar ao Menu</button>
      </div>
    </section>
  `;

  root.querySelector('#to-game').onclick = () => navigateTo('game');
  root.querySelector('#to-menu').onclick = () => navigateTo('menu');

  // ---- ADICIONAR ESTE BLOCO TODO ----

  // ===== ATALHOS DE TECLADO =====
  const handleKeyPress = (e) => {
    // Ignora se estiver a escrever num input (boa prática)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Esc: Voltar ao menu
    if (e.key === 'Escape') {
      navigateTo('menu');
  D }
  };

  document.addEventListener('keydown', handleKeyPress);

  // ⚡ PERFORMANCE: Cleanup de event listeners
  const cleanup = () => {
  	document.removeEventListener('keydown', handleKeyPress);
  };
  
  // Armazenar cleanup para ser chamado ao sair da view
  window.cleanupConfigView = cleanup;

  // ---- FIM DO BLOCO ----

  container.appendChild(root);
}