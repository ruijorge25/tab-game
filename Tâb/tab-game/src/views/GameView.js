import { navigateTo } from '../core/router.js';
import { state } from '../core/state.js';
import { Board } from '../ui/Board.js';
import { Dice, setDiceValue } from '../ui/Dice.js';
import { toast } from '../ui/Toast.js';
import { 
  showVictoryModal, 
  saveGameResult, 
  showRulesModal, 
  showModal,
  closeModal
} from '../ui/Modal.js';
import { 
  playSound, 
  toggleMusic, 
  toggleSFX, 
  setMusicVolume 
} from '../core/audio.js';

import { createTabEngine } from '../game/engine.tab.js';
import { createEngineAdapter } from '../game/engine.adapter.js';
import { findBestMove, getBestMoveWithHint } from '../game/ai.js';

export function renderGameView(container) {
  // Lê as colunas do state global
  const engine = createEngineAdapter(
    createTabEngine({ columns: state.config.columns })
  );
  
  // Lê o nome do jogador guardado no localStorage
  const username = localStorage.getItem('tab_username') || 'Utilizador';

  const root = document.createElement('div');
  root.className = 'game-scene';

  root.innerHTML = `
    <header class="hud">
      <div class="logo">Tâb</div>
      <div class="turn-display">
        <div class="player-indicator" id="player-human">
          <div class="player-icon player-icon-yellow"></div>
          <span class="player-label">${username}</span>
          <div class="piece-counter" id="counter-human">9</div>
        </div>
        <div class="turn-text"><span id="hud-turn"></span></div>
        <div class="player-indicator" id="player-ai">
          <div class="player-icon player-icon-blue"></div>
          <span class="player-label">IA</span>
          <div class="piece-counter" id="counter-ai">9</div>
        </div>
      </div>
      <div class="actions">
      
        <button class="btn-icon" id="btn-toggle-sound" title="Ligar/Desligar Som">
          <svg class="icon-svg icon-sound-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <svg class="icon-svg icon-sound-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        </button>
        
        <button class="btn-icon" id="btn-hints" title="Dicas">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18h6"></path>
            <path d="M10 22h4"></path>
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.33.47 2.48 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path>
          </svg>
        </button>
        <button class="btn-icon" id="btn-shortcuts" title="Atalhos de Teclado">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <line x1="6" y1="8" x2="6.01" y2="8"></line>
            <line x1="10" y1="8" x2="10.01" y2="8"></line>
            <line x1="14" y1="8" x2="14.01" y2="8"></line>
            <line x1="18" y1="8" x2="18.01" y2="8"></line>
            <line x1="8" y1="12" x2="8.01" y2="12"></line>
            <line x1="12" y1="12" x2="12.01" y2="12"></line>
            <line x1="16" y1="12" x2="16.01" y2="12"></line>
            <line x1="7" y1="16" x2="17" y2="16"></line>
          </svg>
        </button>
        <button class="btn-icon" id="btn-rules" title="Regras do Jogo">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </button>
        <button class="btn-icon btn-exit" id="btn-exit" title="Sair do Jogo">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>

    <main class="stage">
      <section class="board-pane"></section>
      <aside class="right-pane">
        <div class="dice-card" id="dice-holder"></div>
      </aside>
    </main>
  `;

  const boardPane = root.querySelector('.board-pane');
  const diceHolder = root.querySelector('#dice-holder');

  let diceBtn; // Referência para o botão do dado (para desativar)

  // Contadores de estatísticas
  let humanMoves = 0;
  let humanCaptures = 0;
  let aiMoves = 0;
  let aiCaptures = 0;

  // 1. Cria o Popover de Áudio (mas mantém-no escondido)
  const audioPopover = document.createElement('div');
  audioPopover.id = 'game-audio-popover';
  audioPopover.className = 'audio-popover';
  audioPopover.style.display = 'none'; // Começa escondido
  audioPopover.style.position = 'absolute'; // Posição será definida ao clicar
  audioPopover.innerHTML = `
    <div class="audio-control">
      <label>Música</label>
      <button 
        id="game-btn-mute-music" 
        class="toggle-switch ${state.config.audio.musicOn ? 'is-on' : ''}"
        aria-label="Ligar/Desligar Música"
      ></button>
    </div>
    <div 
      class="audio-control" 
      id="game-volume-control-wrapper" 
      style="display: ${state.config.audio.musicOn ? 'grid' : 'none'};"
    >
      <label>Volume</label>
      <input 
        type="range" 
        id="game-slider-music-vol" 
        min="0" max="1" step="0.05" 
        value="${state.config.audio.musicVolume}"
      />
    </div>
    <div class="audio-control">
      <label>SFX</label>
      <button 
        id="game-btn-mute-sfx" 
        class="toggle-switch ${state.config.audio.sfxOn ? 'is-on' : ''}"
        aria-label="Ligar/Desligar Efeitos"
      ></button>
    </div>
  `;
  root.appendChild(audioPopover); // Adiciona o popover à view do jogo

  // 2. Seleciona os controlos dentro do popover
  const btnMuteMusic = audioPopover.querySelector('#game-btn-mute-music');
  const sliderVolume = audioPopover.querySelector('#game-slider-music-vol');
  const sliderWrapper = audioPopover.querySelector('#game-volume-control-wrapper');
  const btnMuteSFX = audioPopover.querySelector('#game-btn-mute-sfx');

  // 3. Adiciona lógica aos controlos do popover
  btnMuteMusic.onclick = (e) => {
    e.stopPropagation(); // Impede que o clique feche o menu
    toggleMusic();
    btnMuteMusic.classList.toggle('is-on', state.config.audio.musicOn);
    sliderWrapper.style.display = state.config.audio.musicOn ? 'grid' : 'none';
    updateHUD(); // Atualiza o ícone principal
  };

  btnMuteSFX.onclick = (e) => {
    e.stopPropagation();
    toggleSFX();
    btnMuteSFX.classList.toggle('is-on', state.config.audio.sfxOn);
    updateHUD(); // Atualiza o ícone principal
  };

  sliderVolume.oninput = (e) => {
    e.stopPropagation();
    setMusicVolume(e.target.value);
  };
  
  // Impede que cliques no slider fechem o popover
  sliderVolume.onclick = (e) => e.stopPropagation();

  //Lógica de Jogo (Humano)

  // Board
  const board = Board({
    engine,
    onSelect: (r, c) => {
      // Não permite selecionar se não for a vez do humano
      if (engine.getCurrentPlayer() !== 1) return;
      
      const moves = engine.getValidMoves(r, c);
      if (!moves.length) { toast('Sem jogadas para essa peça'); return; }
      
      board.highlightSelection(r, c, moves);
    },
    onMove: (r, c) => {
      try {
        const res = engine.moveSelectedTo(r, c);
        humanMoves++; // Contabiliza jogada humana
        board.clearHighlights();
        board.render();
        
        if (res?.captured) {
          toast('Captura!', 'success');
          playSound('goodcapture'); //TOCA O SOM DE CAPTURA BOA
          humanCaptures++; //Contabiliza captura humana
        }
        
        // Verificar vitória
        if (checkWinner()) return; //toca o som de vitória
        
        updateHUD();
        
        if (res?.extraTurn) {
          toast('Jogada extra! Pode jogar novamente.', 'success');
        } else {
          // Passa a vez para a IA
          runAITurn();
        }
      } catch (err) {
        toast(err.message || 'Jogada inválida', 'error');
      }
    }
  });
  boardPane.appendChild(board.el);

  // Dado
  const dice = Dice(async () => {
    try {
      const value = engine.rollDice();
      updateHUD();
      // VERIFICA PASSE AUTOMÁTICO (Humano)
      checkAutoPass(1); 
      return value;
    } catch (err) {
      toast(err.message, 'error');
      return engine.getDice();
    }
  });

  // Adiciona um listener ao 'recipiente' do dado
  diceHolder.addEventListener('click', () => {
    // Se o botão de dado existir E estiver desativado...
    if (diceBtn && diceBtn.classList.contains('is-disabled')) {
      
      // Verificamos por que está desativado
      if (engine.getCurrentPlayer() !== 1) {
        // 1. Está desativado porque é a vez da IA
        toast('Aguarde, é a vez do computador.', 'info');
      } else if (engine.getDice() != null) {
        // 2. Está desativado porque o humano já rolou 
        toast('Tem de mover primeiro. Há jogadas disponíveis!', 'warning');
      }
    }
  });

  diceHolder.appendChild(dice);
  diceBtn = dice.querySelector('button'); // Guarda a referência do botão

  // Ações topo
  root.querySelector('#btn-exit').onclick = () => {
  // chama o modal de "Desistir"
  showModal({
    title: 'Sair do Jogo (Desistir)', 
    content: '<p>Tem a certeza que quer sair? <strong>Isto contará como uma derrota</strong> e a vitória será dada à IA.</p>',
    buttons: [
      { 
        text: 'Sim, sair (Desistir)', 
        className: 'btn btn-primary', 
        onClick: () => {
          const { winner } = engine.giveUp(); // O motor calcula quem vence
          triggerEndGame(winner); // Guarda estatísticas da derrota
        }
      },
      { text: 'Cancelar', className: 'btn btn-secondary' }
    ]
  });
};

  root.querySelector('#btn-rules').onclick = () => showRulesModal();
  root.querySelector('#btn-hints').onclick = () => {
    showHint();
  };
  
  // Popover de atalhos
  root.querySelector('#btn-shortcuts').onclick = (e) => {
    e.stopPropagation();
    const existing = document.querySelector('.shortcuts-popover');
    if (existing) {
      existing.remove();
      return;
    }
    
    const popover = document.createElement('div');
    popover.className = 'shortcuts-popover';
    popover.innerHTML = `
      <h4 style="color:var(--sand);font-size:0.95rem;margin-bottom:12px;font-weight:700;text-align:center;">Atalhos de Teclado</h4>
      <div class="shortcuts-list">
        <div class="shortcut-item">
          <kbd class="kbd">Espaço</kbd>
          <span class="shortcut-desc">Lançar Dado</span>
        </div>
        <div class="shortcut-item">
          <kbd class="kbd">H</kbd>
          <span class="shortcut-desc">Ver Dica</span>
        </div>
        <div class="shortcut-item">
          <kbd class="kbd">R</kbd>
          <span class="shortcut-desc">Regras</span>
        </div>
        <div class="shortcut-item">
          <kbd class="kbd">Esc</kbd>
          <span class="shortcut-desc">Sair do Jogo</span>
        </div>
      </div>
    `;
    
    // Posiciona o popover relativo ao botão
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    popover.style.position = 'fixed';
    popover.style.top = `${rect.bottom + 10}px`;
    popover.style.right = `${window.innerWidth - rect.right}px`;
    
    document.body.appendChild(popover);
    
    // Fecha ao clicar fora
    setTimeout(() => {
      const closeHandler = (ev) => {
        if (!popover.contains(ev.target) && ev.target !== btn) {
          popover.remove();
          document.removeEventListener('click', closeHandler, true);
        }
      };
      document.addEventListener('click', closeHandler, true);
    }, 100);
  };
  
  const btnSound = root.querySelector('#btn-toggle-sound');
  let popoverOpen = false;

  // Handler para fechar o popover se clicar fora
  const handleClickOutside = (e) => {
    if (popoverOpen && !audioPopover.contains(e.target) && !btnSound.contains(e.target)) {
      audioPopover.style.display = 'none';
      popoverOpen = false;
      document.removeEventListener('click', handleClickOutside, true);
    }
  };

  btnSound.onclick = (e) => {
    e.stopPropagation(); // Impede que o 'handleClickOutside' seja ativado
    
    if (popoverOpen) {
      // Fecha o popover
      audioPopover.style.display = 'none';
      popoverOpen = false;
      document.removeEventListener('click', handleClickOutside, true);
    } else {
      // Abre o popover
      const rect = btnSound.getBoundingClientRect();
      const rootRect = container.getBoundingClientRect(); // Posição do #app
      
      // Posiciona o popover 10px abaixo do botão
      audioPopover.style.top = (rect.bottom - rootRect.top + 10) + 'px'; 
      // Alinha à direita do botão
      audioPopover.style.right = (rootRect.right - rect.right) + 'px'; 
      
      audioPopover.style.display = 'flex';
      popoverOpen = true;
      // Adiciona listener para fechar ao clicar fora
      document.addEventListener('click', handleClickOutside, true);
    }
  };

  // ATALHOS DE TECLADO 
  const handleKeyPress = (e) => {
    // Ignora se estiver a escrever num input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key.toLowerCase();

    // Espaço: Lançar dado
    if (key === ' ' && !e.repeat) {
      if (engine.getCurrentPlayer() === 1 && engine.getDice() === null && diceBtn) {
        e.preventDefault();
        diceBtn.click();
      }
    }

    // Esc: Fechar modal OU abrir modal de "Sair/Desistir"
    if (key === 'escape') {
      const modal = document.querySelector('.modal-overlay');
      if (modal) {
        // Se um modal (regras, desistir, etc.) estiver aberto, fecha-o
        closeModal(); 
      } else {
        // Se NENHUM modal estiver aberto, ativa o modal de "Sair" (que agora é "Desistir")
        root.querySelector('#btn-exit').click();
      }
    } 

    // H: Mostrar dicas 
    if (key === 'h') {
      showHint(); 
    }

    // R: Mostrar Regras 
    if (key === 'r') {
      showRulesModal();
    }
  };

  document.addEventListener('keydown', handleKeyPress);

  // Cleanup de event listeners para evitar memory leaks
  const cleanup = () => {
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('click', handleClickOutside, true);
  };
  
  // Armazenar cleanup para ser chamado ao sair da view
  window.cleanupGameView = cleanup;

  /* Mostra a dica da melhor jogada (IA Nível Difícil)*/
  function showHint() {
    // Validar se a dica pode ser dada
    if (engine.getCurrentPlayer() !== 1) {
      toast('Não é a sua vez de jogar.', 'warning');
      return;
    }
    if (engine.getDice() == null) {
      toast('Tem de lançar o dado primeiro!', 'warning');
      return;
    }

    // Limpa highlights anteriores
    board.clearHighlights();

    // Pede a melhor jogada E a razão à IA
    const hint = getBestMoveWithHint(engine);

    // Verifica se existe uma jogada
    if (!hint || !hint.move) {
      toast('Não há jogadas possíveis (deveria passar o turno).', 'info');
      return;
    }
    
    const { move, reason } = hint;
    const recommendedPiece = move.piece;

    /* Chama getValidMoves para o motor da UI saber qual peça está "selecionada"*/
    const allValidMovesForPiece = engine.getValidMoves(recommendedPiece.row, recommendedPiece.col);

    if (!allValidMovesForPiece.length) {
      console.error("Erro na Dica: A IA encontrou uma jogada que a UI não considera válida.");
      toast('Erro ao gerar dica.', 'error');
      return;
    }
    
    // Seleciona a PEÇA recomendada e mostra TODOS os seus alvos
    board.highlightSelection(recommendedPiece.row, recommendedPiece.col, allValidMovesForPiece);
    
    // Mostra a razão num toast
    toast(`Dica: ${reason}`, 'success');
  }

  // Lógica de Passe Automático e IA 

  /**
    * Verifica se o jogador atual (humano ou IA) tem de passar a vez.
    * @param {number} player - O jogador (1=Humano, 2=IA) a verificar.
    */
  function checkAutoPass(player) {
    if (engine.getCurrentPlayer() !== player) return false;

    // Só pode verificar se o dado foi rolado
    if (engine.getDice() == null) return false;

    // sem jogadas válidas
    if (engine.canPass()) {
      const playerName = player === 1 ? 'Humano' : 'Computador';
      const diceVal = engine.getDice();
      const hasExtraTurn = [1, 4, 6].includes(diceVal);

      toast(`${playerName} não tem jogadas válidas.`, 'info');
      
      engine.passTurn(); // O motor já trata de não passar o turno se for extra turn
      updateHUD();

      if (hasExtraTurn && player === 1) {
        toast('Pode lançar de novo.', 'success');
      } else if (hasExtraTurn && player === 2) {
        // IA tem jogada extra, joga de novo
        runAITurn();
      } else if (!hasExtraTurn && player === 1) {
        // Humano passou, vez da IA
        runAITurn();
      }

      return true;
    }
    return false;
  }

  /* Executa o turno completo da Inteligência Artificial*/
  async function runAITurn() {
    if (engine.getCurrentPlayer() !== 2) return;

    board.clearHighlights();
    updateHUD(); // Desativa o dado para o humano
    
    // Simular "pensamento"
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      // IA Lança o Dado
      const diceVal = engine.rollDice();
      toast(`Computador rolou ${diceVal}!`, 'info');
      playSound('flip'); // <-- TOCA O SOM DE FLIP (IA)
      updateHUD();
      
      // IA Verifica Passe Automático
      if (checkAutoPass(2)) return; 

      // IA Encontra e Escolhe a Melhor Jogada
      await new Promise(r => setTimeout(r, 800)); // Pausa para ver o dado

      // A IA agora lê o nível de dificuldade do state
      const chosenMove = findBestMove(state.config.aiLevel, engine);

      // Verificamos se 'chosenMove' é nulo (sem jogadas)
      if (!chosenMove) { 
        console.warn("IA sem jogadas, mas canPass() foi falso. A forçar passe.");
        engine.passTurn();
        updateHUD();
        return;
      }
      
      // seleciona a peça no motor 
      engine.getValidMoves(chosenMove.piece.row, chosenMove.piece.col); 
      const res = engine.moveSelectedTo(chosenMove.target.row, chosenMove.target.col);
      aiMoves++; //Contabiliza jogada da IA

      board.render();
      if (res?.captured) {
        toast('Computador capturou!', 'success');
        playSound('badcapture'); // TOCA O SOM DE CAPTURA MÁ
        aiCaptures++; //Contabiliza captura da IA
      }
      
      // Verificar Fim ou Próximo Turno
      if (checkWinner()) return; 
      
      updateHUD();

      if (res.extraTurn) {
        toast('Computador joga de novo!', 'info');
        runAITurn(); // Recurso
      }

    } catch (err) {
      console.error("Erro na IA:", err);
      toast(err.message, 'error');
      // Tenta passar o turno para não bloquear
      try {
        engine.passTurn();
      } catch (passErr) {
        console.error("Erro ao tentar forçar passe:", passErr);
      }
      updateHUD();
    }
  } 

  /**
   * Finaliza o jogo, toca sons, salva estatísticas e mostra o modal.
   * @param {number} winner - O jogador vencedor (1 ou 2).
   */
  function triggerEndGame(winner) {
    if (!winner) return;
    
    // LÓGICA DE SOM DE VITÓRIA/DERROTA
    if (winner === 1) {
      // Jogador 1 (Humano) venceu
      playSound('victory');
    } else {
      // Jogador 2 (IA) venceu ou o Humano desistiu
      playSound('defeat'); // USA O  SOM DE DERROTA
    } // TOCA O SOM DE VITÓRIA
    
    // Salva estatísticas (DO PONTO DE VISTA DO JOGADOR HUMANO)
    const stats = {
      won: winner === 1,
      captures: humanCaptures, // usando o contador
      moves: humanMoves       // usando o contador
    };
    
    saveGameResult(stats);
    
    // Mostra modal de vitória com confetti
    setTimeout(() => {
      showVictoryModal({ 
        winner, 
        stats, // Passa as estatísticas corretas para o modal
        // ADICIONA OS CALLBACKS DE NAVEGAÇÃO
        onPlayAgain: () => navigateTo('game'),
        onGoToMenu: () => navigateTo('menu')
      });
    }, 800);
  }

  /**
    * Verifica se há um vencedor e finaliza o jogo.
    * @returns {boolean} True se o jogo terminou.
    */
  function checkWinner() {
    const winner = engine.checkWinner();
    if (winner) {
      triggerEndGame(winner);
      return true;
    }
    return false;
  }

  /**
    * Atualiza o HUD (informações do turno, estado do dado).
    */
  function updateHUD() {
    const player = engine.getCurrentPlayer();
    
    // Usa a variável username para o texto do turno
    const turn = player === 1 ? username : 'IA'; 
    root.querySelector('#hud-turn').textContent = `Vez de ${turn}`;
    
    // Pulse no indicador do jogador ativo
    const humanIndicator = root.querySelector('#player-human');
    const aiIndicator = root.querySelector('#player-ai');
    
    if (player === 1) {
      humanIndicator.classList.add('active-player');
      aiIndicator.classList.remove('active-player');
    } else {
      aiIndicator.classList.add('active-player');
      humanIndicator.classList.remove('active-player');
    }
    
    //  Atualiza contadores de peças usando a função do motor
    const counts = engine.getPieceCounts();
    root.querySelector('#counter-human').textContent = counts.player1;
    root.querySelector('#counter-ai').textContent = counts.player2;
    
    // Atualiza o valor visual do dado
    setDiceValue(dice, engine.getDice());
    
    // Ativa/desativa o botão do dado
    if (diceBtn) {
      const isDisabled = (player !== 1 || engine.getDice() != null);
      
      diceBtn.classList.toggle('is-disabled', isDisabled);
      diceBtn.style.pointerEvents = isDisabled ? 'none' : 'auto';
      diceBtn.style.opacity = isDisabled ? '0.6' : '1';
      
      if (!isDisabled) {
        diceBtn.classList.add('dice-ready');
      } else {
        diceBtn.classList.remove('dice-ready'); // Remove glow se desativado
      }
    }
    
    // Atualiza o ícone de som 
    if (btnSound) {
      // Adiciona/remove a classe 'is-muted' com base no estado
      const isMuted = !state.config.audio.musicOn && !state.config.audio.sfxOn;
      btnSound.classList.toggle('is-muted', isMuted);
    }
  }

  // Início do Jogo 
  container.appendChild(root);
  updateHUD();
}