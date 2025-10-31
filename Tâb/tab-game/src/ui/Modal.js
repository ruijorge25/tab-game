import { state } from '../core/state.js';

let activeModal = null;
let activeEscHandler = null;

/**
 * Cria e exibe um modal premium
 * @param {Object} options - Configurações do modal
 * @param {string} options.title - Título do modal
 * @param {string} options.content - Conteúdo HTML
 * @param {Array} options.buttons - Array de botões [{text, onClick, className}]
 * @param {Function} options.onClose - Callback ao fechar
 */
export function showModal({ title, content, buttons = [], onClose, className = '' }) {
  // Remove modal anterior se existir
  if (activeModal) {
    closeModal();
  }

  // Cria overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Cria modal
  const modal = document.createElement('div');
  modal.className = `modal ${className}`;
  
  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <h2 class="modal-title">${title}</h2>
    <button class="modal-close" aria-label="Fechar">&times;</button>
  `;
  
  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = content;
  
  // Footer (se houver botões)
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = btn.className || 'btn btn-secondary';
    button.textContent = btn.text;
    button.onclick = () => {
      if (btn.onClick) btn.onClick();
      closeModal();
    };
    footer.appendChild(button);
  });
  
  // Monta modal
  modal.appendChild(header);
  modal.appendChild(body);
  if (buttons.length > 0) {
    modal.appendChild(footer);
  }
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  activeModal = { overlay, onClose };
  
  // Animação de entrada
  requestAnimationFrame(() => {
    overlay.classList.add('show');
  });
  
  // Event listeners
  const closeBtn = header.querySelector('.modal-close');
  closeBtn.onclick = closeModal;
  
  // Fechar ao clicar fora
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  };
  
  // Limpa qualquer ouvinte anterior que possa ter ficado preso
  if (activeEscHandler) {
    document.removeEventListener('keydown', activeEscHandler);
  }

  // Define o NOVO ouvinte e guarda-o na variável global
  activeEscHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(); // O closeModal agora tratará de remover o ouvinte
    }
  };

  document.addEventListener('keydown', activeEscHandler);
}

/*Fecha o modal ativo */

export function closeModal() {
  if (!activeModal) return;

  if (activeEscHandler) {
    document.removeEventListener('keydown', activeEscHandler);
    activeEscHandler = null; // Limpa a referência
  }
  
  const { overlay, onClose } = activeModal;
  
  overlay.classList.remove('show');
  
  setTimeout(() => {
    overlay.remove();
    if (onClose) onClose();
  }, 300);
  
  activeModal = null;
}

/*Modal de Regras do Jogo*/
export function showRulesModal() {
  showModal({
    title: 'Regras do Tâb',
    className: 'modal-rules',
    content: `
      <div class="rules-content">
        <section class="rule-section">
          <h3> Objetivo</h3>
          <p>Capture todas as peças do adversário para vencer!</p>
        </section>

        <section class="rule-section">
          <h3> O Dado de Paus</h3>
          <p>Usa-se 4 paus com duas faces (clara e escura). O resultado define quantas casas a peça avança:</p>
          <ul>
            <li><strong>0 claros → 6</strong> (Sitteh) - Joga novamente</li>
            <li><strong>1 claro → 1</strong> (Tâb) - Joga novamente</li>
            <li><strong>2 claros → 2</strong> (Itneyn)</li>
            <li><strong>3 claros → 3</strong> (Telâteh)</li>
            <li><strong>4 claros → 4</strong> (Arba'ah) - Joga novamente</li>
          </ul>
        </section>

        <section class="rule-section">
          <h3> Primeira Jogada</h3>
          <p>Para mover uma peça pela primeira vez, <strong>deve obter 1</strong> (Tâb) no dado.</p>
          <p>Se sair 4 ou 6, repete o lançamento.</p>
        </section>

        <section class="rule-section">
          <h3>↔ Percurso das Peças</h3>
          <ul>
            <li><strong>1ª linha:</strong> Esquerda → Direita</li>
            <li><strong>2ª linha:</strong> Direita → Esquerda</li>
            <li><strong>3ª linha:</strong> Esquerda → Direita</li>
            <li><strong>4ª linha:</strong> Direita → Esquerda</li>
          </ul>
          <p>Da 3ª linha pode ir para 4ª ou voltar para 2ª.</p>
        </section>

        <section class="rule-section">
          <h3> Capturas</h3>
          <p>Se a casa de destino tiver uma peça adversária, essa peça é <strong>capturada e removida</strong>.</p>
        </section>

        <section class="rule-section">
          <h3> Restrições</h3>
          <ul>
            <li>Só uma peça por casa</li>
            <li>Cada peça entra na 4ª linha apenas uma vez</li>
            <li>Peças na 4ª linha só se movem se nenhuma da sua cor estiver na 1ª linha</li>
            <li>Nenhuma peça pode voltar à linha inicial</li>
          </ul>
        </section>

        <section class="rule-section">
          <h3> Vitória</h3>
          <p>O jogo termina quando um jogador <strong>fica sem peças</strong>. O outro jogador vence!</p>
        </section>
      </div>
    `,
    buttons: [
      { text: 'Entendi', className: 'btn btn-primary' }
    ]
  });
}

/* Modal de Vitória com confetti*/
export function showVictoryModal({ winner, stats = {}, onPlayAgain, onGoToMenu }) {
  const winnerName = winner === 1 ? 'Você' : 'IA';
  const isPlayerWin = winner === 1;
  
  // Só cria confetti se o jogador vencer
  if (isPlayerWin && state.config.animations !== false) {
    createConfetti(150);
  }
  
  showModal({
    title: isPlayerWin ? ' Vitória!' : ' Derrota',
    className: `modal-result ${isPlayerWin ? 'modal-victory' : 'modal-defeat'}`,
    content: `
      <div class="result-content">
        ${isPlayerWin ? '<div class="trophy-3d"></div>' : '<div class="result-icon"></div>'}
        <h3 class="result-message">${isPlayerWin ? 'Parabéns! Você venceu!' : 'A IA venceu desta vez!'}</h3>
        
        ${stats.captures !== undefined ? `
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">Capturas</span>
              <span class="stat-value animated-stat" data-value="${stats.captures || 0}">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Jogadas</span>
              <span class="stat-value animated-stat" data-value="${stats.moves || 0}">0</span>
            </div>
            ${stats.time ? `
              <div class="stat-item">
                <span class="stat-label">Tempo</span>
                <span class="stat-value">${stats.time}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${!isPlayerWin ? '<p class="result-tip"> Dica: Proteja suas peças e planeje capturas!</p>' : ''}
      </div>
    `,
    buttons: [
      { text: 'Jogar Novamente', className: 'btn btn-primary', onClick: () => {
        if (onPlayAgain) onPlayAgain();
      }},
      { text: 'Menu', className: 'btn btn-secondary', onClick: () => {
        if (onGoToMenu) onGoToMenu();
      }}
    ],
    onClose: () => {
      document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }
  });
  
  // Anima as estatísticas
  setTimeout(() => animateStats(), 300);
}

/*Anima números das estatísticas*/
function animateStats() {
  const statElements = document.querySelectorAll('.animated-stat');
  statElements.forEach((el, index) => {
    const targetValue = parseInt(el.dataset.value);
    let currentValue = 0;
    const duration = 1000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = targetValue / steps;
    
    setTimeout(() => {
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(interval);
        }
        el.textContent = Math.floor(currentValue);
      }, stepTime);
    }, index * 200); // Stagger animation
  });
}

/*Cria animação de confetti dourado*/
function createConfetti(count = 150) {
  const colors = ['#CBB279', '#C17F59', '#D4AF37', '#F8F5E1', '#A35F3B'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confetti.style.width = (Math.random() * 6 + 4) + 'px';
    confetti.style.height = (Math.random() * 12 + 8) + 'px';
    document.body.appendChild(confetti);
    
    // Remove após animação
    setTimeout(() => confetti.remove(), 5000);
  }
}

/* Modal de Leaderboard*/
export function showLeaderboardModal() {
  const stats = getPlayerStats();
  
  showModal({
    title: ' Estatísticas',
    className: 'modal-leaderboard',
    content: `
      <div class="leaderboard-content">
        ${stats.username ? `
          <div class="current-player">
            <h3> ${stats.username}</h3>
          </div>
        ` : ''}
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${stats.gamesPlayed || 0}</div>
            <div class="stat-label">Jogos</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.wins || 0}</div>
            <div class="stat-label">Vitórias</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.losses || 0}</div>
            <div class="stat-label">Derrotas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.winRate || 0}%</div>
            <div class="stat-label">Taxa de Vitória</div>
          </div>
        </div>

        ${stats.topGames && stats.topGames.length > 0 ? `
          <div class="top-games">
            <h4>Melhores Partidas</h4>
            <table class="games-table">
              <thead>
                <tr>
                  <th>Resultado</th>
                  <th>Capturas</th>
                  <th>Jogadas</th>
                </tr>
              </thead>
              <tbody>
                ${stats.topGames.slice(0, 5).map(game => `
                  <tr>
                    <td>${game.won ? ' Vitória' : ' Derrota'}</td>
                    <td>${game.captures}</td>
                    <td>${game.moves}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="no-games">Nenhuma partida registrada ainda.</p>'}
      </div>
    `,
    buttons: [
      { text: 'Fechar', className: 'btn btn-primary' }
    ]
  });
}

/*Obtém estatísticas do jogador do localStorage*/
function getPlayerStats() {
  const username = localStorage.getItem('tab_username') || null;
  const gamesData = JSON.parse(localStorage.getItem('tab_games') || '[]');
  
  // Filtra jogos do usuário atual
  const userGames = username 
    ? gamesData.filter(g => g.username === username)
    : gamesData;
  
  const wins = userGames.filter(g => g.won).length;
  const losses = userGames.filter(g => !g.won).length;
  const gamesPlayed = userGames.length;
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  
  return {
    username,
    gamesPlayed,
    wins,
    losses,
    winRate,
    topGames: userGames.sort((a, b) => b.captures - a.captures)
  };
}

/* Salva resultado de jogo no localStorage*/
export function saveGameResult({ won, captures, moves }) {
  const username = localStorage.getItem('tab_username') || 'Anônimo';
  const gamesData = JSON.parse(localStorage.getItem('tab_games') || '[]');
  
  gamesData.push({
    username,
    won,
    captures,
    moves,
    date: new Date().toISOString()
  });
  
  // Mantém apenas últimos 100 jogos
  if (gamesData.length > 100) {
    gamesData.shift();
  }
  
  localStorage.setItem('tab_games', JSON.stringify(gamesData));
}
