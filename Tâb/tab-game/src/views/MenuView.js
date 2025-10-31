import { navigateTo } from '../core/router.js';
import { state } from '../core/state.js';
import { showRulesModal, showLeaderboardModal } from '../ui/Modal.js';

export function renderMenuView(container){
 const root = document.createElement('div');
 root.className = 'view page-enter';

 const savedUsername = localStorage.getItem('tab_username') || '';

 root.innerHTML = `
  <div class="menu-shell">
      <section class="menu-panel">
    <div class="card card--soft login-card">
     <h3>Identificação</h3>
     ${!savedUsername ? `
      <p class="login-desc">Digite seu nome para salvar estatísticas:</p>
      <div class="login-form">
       <input type="text" id="username-input" class="input-field" placeholder="Seu nome" maxlength="20" />
       <button class="btn btn-primary" id="btn-login">Entrar</button>
      </div>
     ` : `
      <div class="user-info">
       <p class="user-greeting">Olá, <strong>${savedUsername}</strong></p>
       <button class="btn btn-secondary btn-small" id="btn-logout">Trocar utilizador</button>
      </div>
     `}
    </div>

    <div class="card settings">
     <h3>Atalhos</h3>
     <div class="shortcuts-list">
      <div class="shortcut-item"><kbd class="kbd">R</kbd><span class="shortcut-desc">Ver Regras</span></div>
      <div class="shortcut-item"><kbd class="kbd">Esc</kbd><span class="shortcut-desc">Fechar Janelas</span></div>
      <div class="shortcut-item"><kbd class="kbd">Tab</kbd><span class="shortcut-desc">Navegar</span></div>
     </div>
    </div>
       </section>

      <section class="menu-panel">
    <div class="logo-bloc">
     <div class="app-logo">TÂB</div>
    </div>
    <div class="card hero-card">
     <div class="hero-actions">
      <button class="btn btn-primary btn-hero" id="btn-play">Novo Jogo</button>
      <button class="btn btn-secondary" id="btn-config">Configurações</button>
      <button class="btn btn-secondary" id="btn-rules">Ver Regras</button>
      <button class="btn btn-secondary" id="btn-leaderboard">Estatísticas</button>
     </div>
    </div>
   </section>

      <section class="menu-panel">
    <div class="card settings settings-scrollable">
     <h3>Configuração Rápida</h3>
     <div class="field">
      <label>Tamanho do tabuleiro</label>
      <select id="q-cols">
       <option value="7">7 colunas</option>
       <option value="9" selected>9 colunas</option>
       <option value="11">11 colunas</option>
       </select>
     </div>
     <div class="field">
      <label>Modo de Jogo</label>
      <select id="q-mode">
       <option value="vs-computer" selected>Contra Computador</option>
       <option value="vs-player" disabled>Contra Jogador (em breve)</option>
      </select>
     </div>
     <div class="field">
      <label>Nível da IA</label>
      <select id="q-ai">
       <option value="easy" selected>Fácil</option>
       <option value="medium">Médio</option>
       <option value="hard">Difícil</option>
      </select>
     </div>
         </div>
   </section>
  </div>
 `; // ===== Event Handlers =====

 // Login
 const loginBtn = root.querySelector('#btn-login');
 if (loginBtn) {
  loginBtn.onclick = () => {
   const input = root.querySelector('#username-input');
   const username = input.value.trim();
   if (!username) {
    input.classList.add('input-error');
    setTimeout(() => input.classList.remove('input-error'), 500);
    return;
   }
   localStorage.setItem('tab_username', username);
   container.innerHTML = '';
   renderMenuView(container);
  };
  root.querySelector('#username-input').onkeypress = (e) => {
   if (e.key === 'Enter') loginBtn.click();
  };
 }

 // Logout
 const logoutBtn = root.querySelector('#btn-logout');
 if (logoutBtn) {
  logoutBtn.onclick = () => {
   localStorage.removeItem('tab_username');
   container.innerHTML = '';
   renderMenuView(container);
  };
 }

 // Novo Jogo
 root.querySelector('#btn-play').onclick = () => {
  root.classList.remove('page-enter');
  root.classList.add('page-leave');
  setTimeout(() => navigateTo('game'), 180);
 };

 // Atualiza state (Config Rápida)
 root.querySelector('#q-cols').onchange = (e) => {
  state.config.columns = parseInt(e.target.value, 10);
 };
 root.querySelector('#q-mode').onchange = (e) => {
  state.config.mode = e.target.value;
 };
 root.querySelector('#q-ai').onchange = (e) => {
  state.config.aiLevel = e.target.value;
 };

 // Configurações
 root.querySelector('#btn-config').onclick = () => {
  root.classList.remove('page-enter');
  root.classList.add('page-leave');
  setTimeout(() => navigateTo('config'), 180);
 };

 // Regras Modal
 root.querySelector('#btn-rules').onclick = () => {
  showRulesModal();
 };

 // Leaderboard Modal
 root.querySelector('#btn-leaderboard').onclick = () => {
  showLeaderboardModal();
 };

 // ===== ATALHOS DE TECLADO =====
 const handleKeyPress = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
   return;
  }
  if (e.key === 'Escape') {
   const modal = document.querySelector('.modal-overlay');
   if (modal) {
    modal.remove();
   }
  }
  if (e.key === 'r' || e.key === 'R') {
   showRulesModal();
  }
 };

 document.addEventListener('keydown', handleKeyPress);

 const cleanup = () => {
  document.removeEventListener('keydown', handleKeyPress);
 };
 window.cleanupMenuView = cleanup;

 container.appendChild(root);
}
