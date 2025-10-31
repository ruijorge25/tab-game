export const state = {
  currentView: 'menu',
  player: { name: 'Guest', loggedIn: false },
  config: { 
    columns: 9, 
    mode: 'vs-computer', 
    firstPlayer: 'human', 
    aiLevel: 'easy',
    
    // Áudio
    audio: {
      musicVolume: 0.3,
      musicOn: false,
      sfxOn: true
    },
    
    // Interface
    theme: 'desert', // 'desert' | 'night' | 'ocean' | 'forest' | 'royal'
    animations: true,
    showHints: true,
    animSpeed: 'normal', // 'fast' | 'normal' | 'slow'
    pieceStyle: 'modern' // 'modern' | 'classic' | 'minimal'
  },
  game: { started: false, dice: null, turn: 1 }
};

export function initState() {
  console.log(' Estado inicializado');
}