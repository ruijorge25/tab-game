export const state = {
  currentView: 'menu',
  player: { name: 'Guest', loggedIn: false },
  config: { 
    columns: 9, 
    mode: 'vs-computer', 
    firstPlayer: 'human', 
    aiLevel: 'easy',
    
    // ---- SUBSTITUIR soundEnabled: true POR ISTO ----
    audio: {
      musicVolume: 0.3, // Volume da música de 0.0 a 1.0
      musicOn: false,    // Música ligada/desligada
      sfxOn: true       // Efeitos sonoros ligados/desligados
    }
    // ---- FIM DA ALTERAÇÃO ----
  },
  game: { started: false, dice: null, turn: 1 }
};

export function initState() {
  console.log(' Estado inicializado');
}