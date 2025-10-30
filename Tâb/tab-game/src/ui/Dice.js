// src/ui/Dice.js - VERSÃO COM MICRO-ANIMAÇÕES E SOM
import { playSound } from '../core/audio.js'; // <-- IMPORTA O playSound

export function Dice(onRoll){
  const wrap = document.createElement('div');
  wrap.className = 'dice';

  const sticks = document.createElement('div');
  sticks.className = 'dice-sticks';
  const arr = [];
  for (let i=0;i<4;i++){
    const s = document.createElement('div');
    s.className = 'stick';
    s.innerHTML = `<div class="stick-face light"></div><div class="stick-face dark"></div>`;
    sticks.appendChild(s); arr.push(s);
  }

  const read = document.createElement('div');
  read.className = 'dice-readout';
  read.innerHTML = `<div id="dice-value"></div><div id="dice-name"></div>`;

  const btn = document.createElement('button');
  btn.className = 'btn btn-primary';
  btn.textContent = 'Lançar Dado';

  //  GLOW DOURADO quando disponível
  btn.classList.add('dice-ready');

  btn.onclick = async () => {
    // Se já estiver desativado pela GameView, não faz nada
    if (btn.classList.contains('is-disabled')) return; 
    
    playSound('flip'); // <-- TOCA O SOM AQUI

    // Remove glow
    btn.classList.remove('dice-ready');
    
    // Desativa-se temporariamente durante a animação
    btn.classList.add('is-disabled'); 
    btn.style.opacity = '0.6';

    arr.forEach(s => s.classList.add('shuffling'));
    await new Promise(r=>setTimeout(r,800));
    arr.forEach(s => s.classList.remove('shuffling'));
    const value = await onRoll?.();
    setDiceVisual(value);
    
    //  BOUNCE quando resultado aparece
    sticks.classList.add('dice-bounce');
    setTimeout(() => sticks.classList.remove('dice-bounce'), 600);
    
    //  PARTÍCULAS DOURADAS para 6 ou 4 (jogada extra)
    if (value === 6 || value === 4) {
      createGoldenParticles(wrap);
    }
 };

  function setDiceVisual(val){
    // 0 claras = 6, 1=1, 2=2, 3=3, 4=4
    const lightFaces = (val===6?0:val);
    arr.forEach((s,idx)=>{
      const light = idx < lightFaces;
      s.style.transform = `rotateY(${light?0:180}deg)`;
    });
    read.querySelector('#dice-value').textContent = `Valor: ${val ?? '-'}`;
    read.querySelector('#dice-name').textContent = nameMap[val] ?? '';
  }

  function createGoldenParticles(container) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 16; i++) {
      const particle = document.createElement('div');
      particle.className = 'golden-particle';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      
      const angle = (i / 16) * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      particle.style.setProperty('--end-x', endX + 'px');
      particle.style.setProperty('--end-y', endY + 'px');
      particle.style.animationDelay = (i * 20) + 'ms';
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  wrap.append(sticks, btn, read);
  return wrap;
}

export function setDiceValue(diceEl, val){
  // compat: tenta atualizar readout se existir
  const read = diceEl?.querySelector?.('.dice-readout');
  if (read){
    const v = read.querySelector('#dice-value');
    const n = read.querySelector('#dice-name');
    const light = (val===6?0:val) ?? 4;
    diceEl.querySelectorAll('.stick').forEach((s,idx)=>{
      s.style.transform = `rotateY(${idx<light?0:180}deg)`;
    });
    if (v) v.textContent = `Valor: ${val ?? '-'}`;
    if (n) n.textContent = nameMap[val] ?? '';
  }
}

const nameMap = { 6:'Sitteh', 1:'Tâb', 2:'Itneyn', 3:'Teláteh', 4:"Arba'ah" };
