import { state } from './state.js';

// --- SEPARAÇÃO DE CANAIS ---
const music = new Audio('src/assets/sounds/music_bg.mp3');
music.loop = true;

const sfx = {
  flip: new Audio('src/assets/sounds/flip.mp3'),
  victory: new Audio('src/assets/sounds/victory.mp3'),
  goodcapture: new Audio('src/assets/sounds/goodcapture.mp3'),
  badcapture: new Audio('src/assets/sounds/badcapture.mp3')
};
// --- FIM DA SEPARAÇÃO ---

/**
 * Toca um EFEITO SONORO (SFX)
 */
export function playSound(name) {
  // 1. Verifica se os SFX estão ligados
  if (!state.config.audio.sfxOn) return;

  const sound = sfx[name];
  if (!sound) {
    return;
  }
  
  sound.volume = 0.5; // Volume fixo para SFX
  
  if (!sound.paused) {
    sound.currentTime = 0;
  }
  
  sound.play().catch(e => {});
}

/**
 * Atualiza o estado da MÚSICA (volume e play/pause)
 * Esta função deve ser chamada sempre que algo no 'state.config.audio' muda
 */
export function updateMusicStatus() {
  const { musicOn, musicVolume } = state.config.audio;

  if (musicOn) {
    music.volume = musicVolume;
    music.play().catch(e => {
      // Ignora erro de "interação"
    });
  } else {
    music.pause();
  }
}

/**
 * Altera o volume da música (chamado pelo slider)
 */
export function setMusicVolume(volume) {
  state.config.audio.musicVolume = parseFloat(volume);
  // Se a música estiver desligada, isto apenas guarda o volume
  // Se estiver ligada, atualiza imediatamente
  if (state.config.audio.musicOn) {
    music.volume = state.config.audio.musicVolume;
  }
}

/**
 * Liga/desliga a MÚSICA
 */
export function toggleMusic() {
  state.config.audio.musicOn = !state.config.audio.musicOn;
  updateMusicStatus();
}

/**
 * Liga/desliga os EFEITOS SONOROS
 */
export function toggleSFX() {
  state.config.audio.sfxOn = !state.config.audio.sfxOn;
}