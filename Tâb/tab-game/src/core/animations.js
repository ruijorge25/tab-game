/**
 * Sistema de Animações Premium com Canvas (VERSÃO 2 CAMADAS SIMPLIFICADA)
 * Gestão de efeitos visuais para cada tema
 * AGORA: Pai Natal à frente e da direita para a esquerda. Resto da neve e luzes atrás.
 */

// --- ALTERADO: Duas camadas de canvas ---
let canvasBg = null; // Canvas de Fundo (atrás do jogo)
let ctxBg = null;
let canvasFg = null; // Canvas da Frente (à frente do jogo)
let ctxFg = null;
let animationFrameBg = null;
let animationFrameFg = null;
let particlesBg = []; // Partículas de Fundo
let particlesFg = []; // Partículas da Frente (APENAS PAI NATAL)
// --- FIM DA ALTERAÇÃO ---

let currentTheme = null;

let pumpkinImage = new Image();
let pumpkinLoaded = false;
pumpkinImage.src = 'src/assets/patterns/abobora.png';
pumpkinImage.onload = () => { 
  pumpkinLoaded = true;
  console.log("Imagem da abóbora carregada.");
};
pumpkinImage.onerror = () => {
  console.error("Falha ao carregar a imagem da abóbora em src/assets/patterns/abobora.png");
};

/**
 * Inicializa o canvas de animações
 */
export function initAnimationCanvas() {
  // Remove canvases anteriores se existirem
  if (canvasBg) canvasBg.remove();
  if (canvasFg) canvasFg.remove();

  // --- ALTERADO: Cria Canvas de FUNDO (BG) ---
  canvasBg = document.createElement('canvas');
  canvasBg.id = 'animation-canvas-bg';
  canvasBg.style.position = 'fixed';
  canvasBg.style.top = '0';
  canvasBg.style.left = '0';
  canvasBg.style.width = '100%';
  canvasBg.style.height = '100%';
  canvasBg.style.pointerEvents = 'none';
  canvasBg.style.zIndex = '0'; // <-- Fica ATRÁS do jogo
  
  document.body.appendChild(canvasBg);
  ctxBg = canvasBg.getContext('2d');

  // --- ADICIONADO: Cria Canvas da FRENTE (FG) ---
  canvasFg = document.createElement('canvas');
  canvasFg.id = 'animation-canvas-fg';
  canvasFg.style.position = 'fixed';
  canvasFg.style.top = '0';
  canvasFg.style.left = '0';
  canvasFg.style.width = '100%';
  canvasFg.style.height = '100%';
  canvasFg.style.pointerEvents = 'none'; // <-- Permite cliques através dele
  canvasFg.style.zIndex = '100'; // <-- Fica À FRENTE do jogo
  
  document.body.appendChild(canvasFg);
  ctxFg = canvasFg.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

/**
 * Ajusta tamanho do canvas
 */
function resizeCanvas() {
  // --- ALTERADO: Redimensiona AMBOS os canvases ---
  if (canvasBg) {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
    if (ctxBg) ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
  }
  if (canvasFg) {
    canvasFg.width = window.innerWidth;
    canvasFg.height = window.innerHeight;
    if (ctxFg) ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);
  }
}

/**
 * Para todas as animações
 */
export function stopAnimations() {
  // --- ALTERADO: Para AMBOS os loops ---
  if (animationFrameBg) cancelAnimationFrame(animationFrameBg);
  if (animationFrameFg) cancelAnimationFrame(animationFrameFg);
  animationFrameBg = null;
  animationFrameFg = null;
  particlesBg = [];
  particlesFg = [];
  currentTheme = null;
  if (ctxBg && canvasBg) ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
  if (ctxFg && canvasFg) ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);
}

/**
 * Inicia animações baseadas no tema
 */
export function startThemeAnimation(theme) {
  stopAnimations();
  currentTheme = theme;
  
  if (!canvasBg) { // Verifica se os canvases foram inicializados
    initAnimationCanvas();
  }
  
  // Limpa AMBOS os canvases
  if (ctxBg && canvasBg) ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
  if (ctxFg && canvasFg) ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);
  
  if (theme === 'desert') {
    return;
  }
  
  // O requestAnimationFrame agora é gerido pelas próprias funções de animação
  requestAnimationFrame(() => {
    switch (theme) {
      case 'desert-night':
        initDesertNight();
        break;
      case 'halloween':
        initHalloween();
        break;
      case 'christmas':
        initChristmas();
        break;
    }
  });
}

// ============================================
// FUNÇÕES DE ANIMAÇÃO DE FUNDO (BG Loop)
// ============================================
function animateBackground() {
  if (currentTheme !== 'desert-night' && currentTheme !== 'halloween' && currentTheme !== 'christmas') {
    cancelAnimationFrame(animationFrameBg);
    animationFrameBg = null;
    return;
  }
  
  ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
  
  particlesBg.forEach(particle => {
    particle.update();
    particle.draw(ctxBg); // Todas as partículas de fundo usam ctxBg
  });
  
  if (currentTheme === 'halloween' && lightning) {
    lightningTimer++;
    if (lightningTimer > 400 && Math.random() < 0.008) {
      lightning.trigger();
      lightningTimer = 0;
    }
    lightning.update();
    lightning.draw(ctxBg);
  }

  // --- ADICIONADO: Cabo das luzes de natal no BG ---
  if (currentTheme === 'christmas') {
    ctxBg.strokeStyle = 'rgba(40, 40, 40, 0.8)';
    ctxBg.lineWidth = 3;
    ctxBg.beginPath();
    ctxBg.moveTo(0, 30);
    ctxBg.lineTo(canvasBg.width, 30);
    ctxBg.stroke();
  }
  // --- FIM DA ADIÇÃO ---
  
  animationFrameBg = requestAnimationFrame(animateBackground);
}


// ============================================
// FUNÇÕES DE ANIMAÇÃO DA FRENTE (FG Loop) - APENAS PAI NATAL
// ============================================
function animateForeground() {
  if (currentTheme !== 'christmas') { // APENAS para o tema Christmas
    cancelAnimationFrame(animationFrameFg);
    animationFrameFg = null;
    return;
  }
  
  ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);
  
  particlesFg.forEach(particle => {
    particle.update();
    particle.draw(ctxFg); // O Pai Natal usa ctxFg
  });
  
  animationFrameFg = requestAnimationFrame(animateForeground);
}


// ============================================
// DESERT NIGHT - Céu Estrelado Profissional
// ============================================

class Star {
  constructor() {
    this.x = Math.random() * canvasBg.width; // Usa canvasBg
    this.y = Math.random() * canvasBg.height; // Usa canvasBg
    this.radius = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }
  
  update() {
    this.twinklePhase += this.twinkleSpeed;
    this.opacity = 0.3 + Math.sin(this.twinklePhase) * 0.4;
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvasBg.width; // Usa canvasBg
    this.y = Math.random() * canvasBg.height * 0.5; // Usa canvasBg
    this.length = Math.random() * 80 + 40;
    this.speed = Math.random() * 8 + 6;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // ~45 graus
    this.opacity = 1;
    this.trailOpacity = 0.6;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= 0.008;
    
    // Reset quando sair da tela ou desaparecer
    if (this.opacity <= 0 || this.x > canvasBg.width + 100 || this.y > canvasBg.height + 100) {
      // Chance de reaparecer
      if (Math.random() < 0.01) {
        this.reset();
      }
    }
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    if (this.opacity <= 0) return;
    
    const tailX = this.x - this.vx * 10;
    const tailY = this.y - this.vy * 10;
    
    // Trail
    const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    
    // Head (estrela brilhante)
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initDesertNight() {
  particlesBg = []; // Usa particlesBg
  
  // Criar estrelas fixas (150-200)
  const starCount = 150 + Math.floor(Math.random() * 50);
  for (let i = 0; i < starCount; i++) {
    particlesBg.push(new Star()); // Adiciona a particlesBg
  }
  
  // Criar 3-5 estrelas cadentes
  const shootingStarCount = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < shootingStarCount; i++) {
    particlesBg.push(new ShootingStar()); // Adiciona a particlesBg
  }
  
  animateBackground(); // Inicia o loop de Fundo
}


// ============================================
// HALLOWEEN - Partículas Místicas + Atmosfera
// ============================================

class MysticParticle {
  constructor() {
    this.x = Math.random() * canvasBg.width;
    this.y = Math.random() * canvasBg.height;
    this.radius = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -Math.random() * 0.3 - 0.2;
    this.opacity = Math.random() * 0.3 + 0.2;
    this.color = Math.random() > 0.5 ? '#9370db' : '#ff8c00';
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    
    if (this.life < 50) {
      this.opacity = (this.life / 50) * 0.5;
    }
    
    if (this.life <= 0 || this.y < -10) {
      this.x = Math.random() * canvasBg.width;
      this.y = canvasBg.height + 10;
      this.life = this.maxLife;
      this.opacity = Math.random() * 0.3 + 0.2;
    }
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// Morcego
class Bat {
  constructor() {
    this.reset();
  }
  
  reset() {
    const side = Math.random() > 0.5 ? -1 : 1;
    this.x = side > 0 ? -50 : canvasBg.width + 50;
    this.y = Math.random() * (canvasBg.height * 0.6) + 50;
    this.vx = side * (Math.random() * 2 + 3);
    this.vy = (Math.random() - 0.5) * 2;
    this.wingPhase = Math.random() * Math.PI * 2;
    this.wingSpeed = 0.3;
    this.size = Math.random() * 0.5 + 0.7;
    this.opacity = 0;
    this.fadeIn = true;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.wingPhase += this.wingSpeed;
    
    if (this.fadeIn) {
      this.opacity += 0.02;
      if (this.opacity >= 0.6) this.fadeIn = false;
    }
    
    if (Math.random() < 0.02) {
      this.vy += (Math.random() - 0.5) * 1;
    }
    
    if (this.x < -100 || this.x > canvasBg.width + 100) {
      this.reset();
    }
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size, this.size);
    ctx.globalAlpha = this.opacity;
    
    const wingAngle = Math.sin(this.wingPhase) * 0.5;
    
    // Corpo
    ctx.fillStyle = '#000000ff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    ctx.beginPath();
    ctx.arc(0, -10, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Orelhas
    ctx.beginPath();
    ctx.moveTo(-4, -14);
    ctx.lineTo(-6, -18);
    ctx.lineTo(-2, -16);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(4, -14);
    ctx.lineTo(6, -18);
    ctx.lineTo(2, -16);
    ctx.fill();
    
    // Asa esquerda
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.quadraticCurveTo(-20, -5, -25, 5);
    ctx.quadraticCurveTo(-20, 8, -8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Asa direita
    ctx.save();
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(20, -5, 25, 5);
    ctx.quadraticCurveTo(20, 8, 8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    ctx.restore();
  }
}

// Abóbora (JS Canvas - VERSÃO FINAL)
class Pumpkin {
  constructor() {
    this.size = 100;
    this.glowPhase = Math.random() * Math.PI * 2;
    this.glowSpeed = 0.03;

    // --- ADICIONADO: Limites mínimos ---
    // Baseado no CSS do .menu-shell (min-height: 720px)
    // e na largura mínima dos painéis (320+320+gap)
    this.minWidth = 900; 
    this.minHeight = 720;
  }

  update() {
    this.glowPhase += this.glowSpeed;
  }

  draw(ctx) {
    // 'ctx.canvas' é o 'canvasFg', que tem o tamanho da JANELA

    // --- REGRA DE DESAPARECER ---
    // Se a janela for mais pequena que o menu, não desenha
    if (!pumpkinLoaded || ctx.canvas.width < this.minWidth || ctx.canvas.height < this.minHeight) {
      return; // Desaparece
    }
    // --- FIM DA REGRA ---

    const glow = 0.8 + Math.sin(this.glowPhase) * 0.2;

    // Posição "fixa" no canto da JANELA
    const x = ctx.canvas.width - 100; 
    const y = ctx.canvas.height - 80;

    ctx.save();
    ctx.translate(x, y); 

    ctx.shadowBlur = 50 * glow; 
    ctx.shadowColor = '#ffd700';

    ctx.drawImage(
      pumpkinImage, 
      -this.size / 2,
      -this.size / 2,
      this.size, 
      this.size
    );

    ctx.restore();
  }
}

// Névoa
class Fog {
  constructor() {
    this.x = Math.random() * canvasBg.width;
    this.y = Math.random() * canvasBg.height; // <-- ALTERADO: Y aleatório
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.2; // <-- ADICIONADO: VY aleatório
    this.size = Math.random() * 150 + 100;
    this.opacity = Math.random() * 0.15 + 0.1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy; // <-- ADICIONADO
    
    // Wrap around X (horizontal)
    if (this.x < -this.size) this.x = canvasBg.width + this.size;
    if (this.x > canvasBg.width + this.size) this.x = -this.size;

    // Wrap around Y (vertical)
    if (this.y < -this.size) this.y = canvasBg.height + this.size;
    if (this.y > canvasBg.height + this.size) this.y = -this.size;
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, `rgba(147, 112, 219, ${this.opacity})`);
    gradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
  }
}

let lightningTimer = 0;
// Relâmpago (efeito visual de raio)
class Lightning {
  constructor() {
    this.active = false;
    this.points = [];
    this.opacity = 0;
  }
  
  trigger() {
    this.active = true;
    this.opacity = 1;
    this.generateBolt();
  }
  
  generateBolt() {
    this.points = [];
    const startX = Math.random() * canvasBg.width;
    const startY = 0;
    const endY = canvasBg.height * 0.7;
    
    let currentX = startX;
    let currentY = startY;
    
    // Criar pontos do raio com variação
    while (currentY < endY) {
      this.points.push({ x: currentX, y: currentY });
      currentX += (Math.random() - 0.5) * 60;
      currentY += Math.random() * 50 + 30;
    }
    this.points.push({ x: currentX, y: endY });
    
    // Ramificações
    this.branches = [];
    for (let i = 1; i < this.points.length - 1; i++) {
      if (Math.random() < 0.3) {
        const branchPoints = [];
        const startPoint = this.points[i];
        let bx = startPoint.x;
        let by = startPoint.y;
        const branchLength = Math.random() * 3 + 2;
        
        for (let j = 0; j < branchLength; j++) {
          branchPoints.push({ x: bx, y: by });
          bx += (Math.random() - 0.5) * 40;
          by += Math.random() * 30 + 20;
        }
        this.branches.push(branchPoints);
      }
    }
  }
  
  update() {
    if (this.active) {
      this.opacity -= 0.1;
      if (this.opacity <= 0) {
        this.active = false;
        this.opacity = 0;
      }
    }
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    if (!this.active) return;
    
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Flash de fundo
    const bgFlash = ctx.createRadialGradient(
      canvasBg.width / 2, canvasBg.height / 2, 0,
      canvasBg.width / 2, canvasBg.height / 2, canvasBg.width
    );
    bgFlash.addColorStop(0, 'rgba(147, 112, 219, 0.3)');
    bgFlash.addColorStop(1, 'rgba(147, 112, 219, 0)');
    ctx.fillStyle = bgFlash;
    ctx.fillRect(0, 0, canvasBg.width, canvasBg.height);
    
    // Desenhar raio principal
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#9370db';
    ctx.strokeStyle = '#e6e6fa';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
    
    // Brilho interno
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
    
    // Ramificações
    ctx.strokeStyle = '#e6e6fa';
    ctx.lineWidth = 2;
    this.branches.forEach(branch => {
      ctx.beginPath();
      ctx.moveTo(branch[0].x, branch[0].y);
      for (let i = 1; i < branch.length; i++) {
        ctx.lineTo(branch[i].x, branch[i].y);
      }
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

let lightning = null;

function initHalloween() {
  particlesBg = []; // Usa particlesBg
  
  // Partículas místicas
  for (let i = 0; i < 30; i++) {
    particlesBg.push(new MysticParticle());
  }
  
  // Morcegos
  for (let i = 0; i < 4; i++) {
    particlesBg.push(new Bat());
  }

  particlesBg.push(new Pumpkin());
  
  // Névoa
  for (let i = 0; i < 12; i++) {
    particlesBg.push(new Fog());
  }
  
  lightning = new Lightning();
  lightningTimer = 0;
  
  animateBackground(); // Inicia o loop de Fundo
}

// ============================================
// CHRISTMAS - Classes
// ============================================

// --- 1. Flocos de Neve (BG) ---
class Snowflake {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvasBg.width; // Usa canvasBg
    this.y = -10;
    this.radius = Math.random() * 4 + 2;
    this.speed = Math.random() * 1.5 + 0.8;
    this.wind = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.swingSpeed = Math.random() * 0.03 + 0.01;
    this.swingPhase = Math.random() * Math.PI * 2;
  }
  
  update() {
    this.y += this.speed;
    this.swingPhase += this.swingSpeed;
    this.x += Math.sin(this.swingPhase) * 0.8 + this.wind;
    
    if (this.y > canvasBg.height + 10) {
      this.reset();
    }
    
    if (this.x > canvasBg.width + 10) this.x = -10;
    if (this.x < -10) this.x = canvasBg.width + 10;
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'white';
    
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.radius);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = this.radius * 0.25;
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// --- 2. Luzes de Natal (BG) ---
class ChristmasLight {
  constructor(x, index) {
    this.x = x;
    this.y = 30; // Movido para o topo
    this.index = index;
    this.colors = ['#c41e3a', '#ffffff', '#2e8b57', '#e6f7ff']; // Cores originais
    this.color = this.colors[index % this.colors.length];
    this.glowPhase = Math.random() * Math.PI * 2;
    this.glowSpeed = 0.06 + Math.random() * 0.04;
    this.baseRadius = 6;
  }
  
  update() {
    this.glowPhase += this.glowSpeed;
  }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    const glow = 0.6 + Math.sin(this.glowPhase) * 0.4;
    const radius = this.baseRadius + glow * 2;
    
    ctx.save();
    
    // Glow externo grande
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, radius * 4
    );
    gradient.addColorStop(0, this.color + 'dd');
    gradient.addColorStop(0.3, this.color + '80');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = glow * 0.7;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Lâmpada principal
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 20 * glow;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // Brilho central branco
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.globalAlpha = glow * 0.8;
    ctx.fill();
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// --- 3. Pai Natal (FG) ---
class SantaSleigh {
  constructor() {
    this.reset();
  }
  
  reset() {
    // Começa fora da tela à ESQUERDA e move-se para a DIREITA
    this.x = -300; // Começa à esquerda
    this.y = Math.random() * (canvasFg.height * 0.4) + 80; // Usa canvasFg
    this.speed = 3 + Math.random() * 2; // Velocidade POSITIVA para ir para a direita
    this.wavePhase = 0;
    this.waveSpeed = 0.05;
    this.scale = 0.8 + Math.random() * 0.4;

    // Ajusta a altura Y para não ficar tapado pela neve do chão (no BG)
    const snowLine = canvasFg.height - 80; 
    if (this.y > snowLine) {
      this.y = snowLine;
    }
  }
  
  update() {
    this.x += this.speed;
    this.wavePhase += this.waveSpeed;
    
    this.y += Math.sin(this.wavePhase) * 0.5;
    
    // Reset quando sair completamente pela DIREITA
    if (this.x > canvasFg.width + 300) {
      this.reset();
    }
  }
  
  draw(ctx) { // Recebe o contexto (será ctxFg)
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = 0.9;
    
    // SEM espelhamento - renas e Pai Natal olham para a direita naturalmente
    
    // Renas (3 renas)
    for (let i = 0; i < 3; i++) {
      const offsetX = i * 60; // Distância entre renas
      const jumpPhase = this.wavePhase + i * 0.5;
      const jumpY = Math.sin(jumpPhase * 2) * 8;
      
      this.drawReindeer(ctx, offsetX, jumpY); // Passa o contexto
    }
    
    // Trenó
    this.drawSleigh(ctx, 40, 0); // Passa o contexto
    
    // Pai Natal
    this.drawSanta(ctx, 0, -10); // Passa o contexto
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  
  drawReindeer(ctx, x, y) { // Recebe o contexto
    ctx.save();
    ctx.translate(x, y);
    
    // Corpo da rena
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça (agora virada para a DIREITA)
    ctx.beginPath();
    ctx.ellipse(18, -8, 10, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Chifres (espelhados para a direita)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, -14);
    ctx.lineTo(22, -20);
    ctx.lineTo(19, -18);
    ctx.moveTo(20, -14);
    ctx.lineTo(17, -19);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(16, -14);
    ctx.lineTo(14, -20);
    ctx.lineTo(17, -18);
    ctx.moveTo(16, -14);
    ctx.lineTo(13, -19);
    ctx.stroke();
    
    // Nariz vermelho (Rudolph!) - agora à direita
    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.arc(25, -8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Pernas
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, 10);
    ctx.lineTo(-8, 20);
    ctx.moveTo(8, 10);
    ctx.lineTo(8, 20);
    ctx.stroke();
    
    // Cauda (agora à esquerda)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -2);
    ctx.lineTo(-25, -5);
    ctx.stroke();
    
    ctx.restore();
  }
  
  drawSleigh(ctx, x, y) { // Recebe o contexto
    ctx.save();
    ctx.translate(x, y);
    
    // Base do trenó (vermelho)
    ctx.fillStyle = '#cc0000';
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.quadraticCurveTo(-35, 15, -30, 20);
    ctx.lineTo(40, 20);
    ctx.quadraticCurveTo(45, 15, 40, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Patins
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-35, 22);
    ctx.quadraticCurveTo(-40, 25, -38, 24);
    ctx.lineTo(42, 24);
    ctx.quadraticCurveTo(47, 25, 45, 22);
    ctx.stroke();
    
    // Decorações douradas
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, 8);
    ctx.lineTo(35, 8);
    ctx.stroke();
    
    ctx.restore();
  }
  
  drawSanta(ctx, x, y) { // Recebe o contexto
    ctx.save();
    ctx.translate(x, y);
    
    // Corpo (vermelho)
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.ellipse(0, 5, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    ctx.fillStyle = '#ffd4a3';
    ctx.beginPath();
    ctx.arc(0, -15, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Gorro
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.moveTo(-10, -18);
    ctx.lineTo(10, -18);
    ctx.lineTo(8, -30);
    ctx.lineTo(-8, -30);
    ctx.closePath();
    ctx.fill();
    
    // Pompom do gorro
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(7, -32, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Borda do gorro
    ctx.fillRect(-10, -20, 20, 3);
    
    // Barba
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(0, -8, 10, 8, 0, 0, Math.PI);
    ctx.fill();
    
    // Cinto
    ctx.fillStyle = '#000000';
    ctx.fillRect(-15, 8, 30, 4);
    
    // Fivela
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-4, 7, 8, 6);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(-4, 7, 8, 6);
    
    // Braço segurando rédeas
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.ellipse(-15, 0, 6, 12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Mão/Luva
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-22, 8, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Rédeas
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-22, 8);
    ctx.lineTo(-60, 0);
    ctx.stroke();
    
    ctx.restore();
  }
}

// --- 3.5. Grinch a Caminhar (FG) - VERSÃO ULTRA REALISTA ---
class GrinchWalking {
  constructor() {
    this.reset();
  }
  
  reset() {
    // Começa à direita e vai para a esquerda (a fugir!)
    this.x = canvasFg.width + 200;
    this.y = canvasFg.height - 95; // Caminha no chão
    this.speed = -2.2; // Velocidade natural de caminhada
    this.walkPhase = 0;
    this.walkSpeed = 0.12; // Velocidade mais suave da animação
    this.scale = 1.3; // Tamanho maior e mais imponente
    this.breathPhase = 0;
  }
  
  update() {
    this.x += this.speed;
    this.walkPhase += this.walkSpeed;
    this.breathPhase += 0.03;
    
    // Efeito de subir/descer ao caminhar (mais subtil)
    this.bobY = Math.sin(this.walkPhase * 2) * 2;
    
    // Reset quando sair pela esquerda
    if (this.x < -250) {
      this.reset();
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y + this.bobY);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = 0.98;
    
    // Espelha para olhar para a esquerda
    ctx.scale(-1, 1);
    
    // Sombra no chão
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 50, 30, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Saco de prendas nas costas
    this.drawSack(ctx, -22, -35);
    
    // Pernas (animadas) - desenhar primeiro para ficar atrás
    this.drawLegs(ctx);
    
    // Corpo do Grinch
    this.drawBody(ctx);
    
    // Braço traseiro segurando o saco
    this.drawBackArm(ctx);
    
    // Cabeça
    this.drawHead(ctx);
    
    // Braço da frente (livre)
    this.drawFrontArm(ctx);
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  
  drawSack(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    // Balanço do saco ao caminhar
    const swing = Math.sin(this.walkPhase) * 0.08;
    ctx.rotate(swing);
    
    // Sombra do saco
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(3, 3, 24, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Saco VERMELHO grande com gradiente 3D
    const gradient = ctx.createRadialGradient(-8, -15, 5, 0, 0, 30);
    gradient.addColorStop(0, '#DC143C');
    gradient.addColorStop(0.5, '#B71C1C');
    gradient.addColorStop(1, '#8B0000');
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#5D0000';
    ctx.lineWidth = 2.5;
    
    // Formato do saco mais realista (com volume)
    ctx.beginPath();
    ctx.moveTo(-18, -22);
    ctx.bezierCurveTo(-22, -10, -22, 10, -15, 25);
    ctx.bezierCurveTo(-10, 30, 10, 30, 15, 25);
    ctx.bezierCurveTo(22, 10, 22, -10, 18, -22);
    ctx.bezierCurveTo(15, -25, -15, -25, -18, -22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Amarração do saco (corda grossa dourada)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -20, 18, Math.PI + 0.3, Math.PI * 2 - 0.3);
    ctx.stroke();
    
    // Corda mais fina em cima
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -20, 17, Math.PI + 0.4, Math.PI * 2 - 0.4);
    ctx.stroke();
    
    // Nó da corda volumétrico dourado
    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(-3, -20, 6, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // ========== DUAS PRENDAS NO TOPO DO SACO (saindo para fora) ==========
    
    // PRENDA 1 (esquerda no topo)
    ctx.save();
    ctx.translate(-10, -28);
    ctx.rotate(-0.25);
    
    // Caixa verde com gradiente
    const gift1Grad = ctx.createLinearGradient(-5, -5, 5, 5);
    gift1Grad.addColorStop(0, '#4CAF50');
    gift1Grad.addColorStop(1, '#2E7D32');
    ctx.fillStyle = gift1Grad;
    ctx.fillRect(-5.5, -5.5, 11, 11);
    ctx.strokeStyle = '#1B5E20';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-5.5, -5.5, 11, 11);
    
    // Laço dourado
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -5.5);
    ctx.lineTo(0, 5.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5.5, 0);
    ctx.lineTo(5.5, 0);
    ctx.stroke();
    
    // Laço em cima (decorativo)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-2.5, -8, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(2.5, -8, 2.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Centro do laço
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(0, -8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // PRENDA 2 (direita no topo)
    ctx.save();
    ctx.translate(10, -26);
    ctx.rotate(0.2);
    
    // Caixa azul com gradiente
    const gift2Grad = ctx.createLinearGradient(-4.5, -4.5, 4.5, 4.5);
    gift2Grad.addColorStop(0, '#2196F3');
    gift2Grad.addColorStop(1, '#1565C0');
    ctx.fillStyle = gift2Grad;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-5, -5, 10, 10);
    
    // Laço vermelho
    ctx.strokeStyle = '#FF1744';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.stroke();
    
    // Laço em cima (decorativo)
    ctx.fillStyle = '#FF1744';
    ctx.beginPath();
    ctx.arc(-2, -7.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(2, -7.5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Centro do laço
    ctx.fillStyle = '#C62828';
    ctx.beginPath();
    ctx.arc(0, -7.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Remendos no saco (mantém o visual usado)
    ctx.fillStyle = 'rgba(139, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-12, 10, 6, 9, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(100, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(10, -2, 5, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Costuras nos remendos
    ctx.strokeStyle = 'rgba(62, 47, 31, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.strokeRect(-16, 6, 8, 8);
    ctx.strokeRect(7, -6, 6, 8);
    ctx.setLineDash([]);
    
    // Rugas/vincos do saco
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-12, -15 + i * 8);
      ctx.quadraticCurveTo(0, -13 + i * 8, 12, -15 + i * 8);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  drawBody(ctx) {
    const breath = Math.sin(this.breathPhase) * 1.5;
    
    // Corpo verde peludo com gradiente
    const bodyGrad = ctx.createRadialGradient(-3, -5, 5, 0, 0, 25);
    bodyGrad.addColorStop(0, '#7FA047');
    bodyGrad.addColorStop(1, '#556B2F');
    ctx.fillStyle = bodyGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 0 + breath, 16, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pelos/textura no corpo (linhas sutis)
    ctx.strokeStyle = 'rgba(75, 95, 32, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const x1 = Math.cos(angle) * 12;
      const y1 = Math.sin(angle) * 20;
      const x2 = Math.cos(angle) * 16;
      const y2 = Math.sin(angle) * 26;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Roupa vermelha rasgada (túnica) com mais detalhes
    const clothGrad = ctx.createLinearGradient(-15, -5, 15, 20);
    clothGrad.addColorStop(0, '#A01010');
    clothGrad.addColorStop(1, '#6B0000');
    ctx.fillStyle = clothGrad;
    
    ctx.beginPath();
    ctx.moveTo(-14, -3);
    ctx.lineTo(14, -5);
    ctx.lineTo(17, 20);
    ctx.lineTo(-17, 20);
    ctx.closePath();
    ctx.fill();
    
    // Borda rasgada
    ctx.strokeStyle = '#4B0000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Rasgões na roupa (mais realistas)
    ctx.strokeStyle = '#2B0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, 3);
    ctx.lineTo(-7, 8);
    ctx.lineTo(-11, 13);
    ctx.lineTo(-8, 17);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(7, -2);
    ctx.lineTo(10, 5);
    ctx.lineTo(8, 10);
    ctx.stroke();
    
    // Cinto/corda velha com textura
    ctx.strokeStyle = '#4A3C28';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-17, 6);
    ctx.lineTo(17, 8);
    ctx.stroke();
    
    // Nó do cinto
    ctx.fillStyle = '#3A2C18';
    ctx.beginPath();
    ctx.arc(-12, 7, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawHead(ctx) {
    ctx.save();
    ctx.translate(0, -28);
    
    // Cabeça verde com gradiente e volume
    const headGrad = ctx.createRadialGradient(-5, -8, 3, 0, 0, 18);
    headGrad.addColorStop(0, '#9DC183');
    headGrad.addColorStop(0.6, '#7FA047');
    headGrad.addColorStop(1, '#5A7B2E');
    ctx.fillStyle = headGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Contorno da cabeça
    ctx.strokeStyle = 'rgba(75, 95, 32, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Orelhas pontudas
    ctx.fillStyle = '#6B8E23';
    // Orelha esquerda
    ctx.beginPath();
    ctx.ellipse(-13, -5, 4, 7, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#556B2F';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Orelha direita
    ctx.beginPath();
    ctx.ellipse(13, -5, 4, 7, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Olhos amarelos brilhantes com brilho
    ctx.fillStyle = '#FFFF33';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFFF00';
    ctx.beginPath();
    ctx.ellipse(-5.5, -5, 5, 6.5, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5.5, -5, 5, 6.5, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Contorno dos olhos
    ctx.strokeStyle = '#E6E600';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(-5.5, -5, 5, 6.5, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(5.5, -5, 5, 6.5, 0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Pupilas pequenas e malvadas
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-5.5, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5.5, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Reflexo nos olhos (mais realista)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(-7, -6, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -6, 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Sobrancelhas grossas e malvadas (mais definidas)
    ctx.strokeStyle = '#4B5F20';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.quadraticCurveTo(-7.5, -8.5, -2, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, -10);
    ctx.quadraticCurveTo(7.5, -8.5, 2, -8);
    ctx.stroke();
    
    // Bochechas (detalhes faciais)
    ctx.fillStyle = 'rgba(127, 160, 71, 0.3)';
    ctx.beginPath();
    ctx.ellipse(-9, 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(9, 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Sorriso malvado LARGO e curvado (boca fechada primeiro)
    ctx.fillStyle = '#2B3D10';
    ctx.beginPath();
    ctx.ellipse(0, 7, 12, 5, 0, 0, Math.PI);
    ctx.fill();
    
    // Linha do sorriso
    ctx.strokeStyle = '#1A2508';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 5, 11, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // Dentes superiores organizados
    ctx.fillStyle = '#FFFACD';
    ctx.strokeStyle = '#1A2508';
    ctx.lineWidth = 0.8;
    
    const teethPositions = [-9, -6, -3, 0, 3, 6, 9];
    teethPositions.forEach((x, i) => {
      // Dente
      ctx.beginPath();
      ctx.moveTo(x - 1.2, 6.5);
      ctx.lineTo(x, 10);
      ctx.lineTo(x + 1.2, 6.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Linha entre dentes
      if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(x - 1.5, 6.5);
        ctx.lineTo(x - 1.5, 8);
        ctx.stroke();
      }
    });
    
    // Nariz pequeno e pontudo (mais definido)
    const noseGrad = ctx.createLinearGradient(-1, -2, 1, 4);
    noseGrad.addColorStop(0, '#6B8E23');
    noseGrad.addColorStop(1, '#556B2F');
    ctx.fillStyle = noseGrad;
    
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.lineTo(-2.5, 3);
    ctx.lineTo(2.5, 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#4B5F20';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Narinas
    ctx.fillStyle = '#2B3D10';
    ctx.beginPath();
    ctx.arc(-1, 2.5, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1, 2.5, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Gorro de Pai Natal roubado (torto e amassado)
    ctx.fillStyle = '#C41E3A';
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 1.5;
    ctx.save();
    ctx.rotate(-0.35);
    
    ctx.beginPath();
    ctx.moveTo(-12, -14);
    ctx.quadraticCurveTo(-11, -16, 12, -14);
    ctx.lineTo(16, -28);
    ctx.quadraticCurveTo(14, -30, -10, -27);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Borda branca do gorro (um pouco suja)
    ctx.fillStyle = '#F5F5DC';
    ctx.beginPath();
    ctx.rect(-12, -16, 24, 3.5);
    ctx.fill();
    ctx.strokeStyle = '#E8E8D0';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Pompom volumétrico
    ctx.fillStyle = '#F5F5DC';
    ctx.strokeStyle = '#E8E8D0';
    ctx.beginPath();
    ctx.arc(13, -30, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Detalhe no pompom
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(11, -31, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Pelos/cabelo saindo do gorro (mais naturais)
    ctx.strokeStyle = '#6B8E23';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const angle = -0.3 + (i * 0.1);
      ctx.beginPath();
      ctx.moveTo(-11 + i * 4, -13);
      ctx.quadraticCurveTo(-10 + i * 4, -10, -12 + i * 4.5, -8);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  drawLegs(ctx) {
    // Animação de caminhada - pernas alternadas
    const leftLegAngle = Math.sin(this.walkPhase) * 0.5;
    const rightLegAngle = Math.sin(this.walkPhase + Math.PI) * 0.5;
    
    // Perna esquerda (traseira)
    ctx.save();
    ctx.translate(-7, 24);
    ctx.rotate(leftLegAngle);
    
    const legGrad = ctx.createLinearGradient(-3, 0, 3, 25);
    legGrad.addColorStop(0, '#7FA047');
    legGrad.addColorStop(1, '#556B2F');
    ctx.fillStyle = legGrad;
    ctx.strokeStyle = '#4B5F20';
    ctx.lineWidth = 1;
    
    ctx.fillRect(-3.5, 0, 7, 26);
    ctx.strokeRect(-3.5, 0, 7, 26);
    
    // Pé com dedos
    ctx.fillStyle = '#4B5F20';
    ctx.beginPath();
    ctx.ellipse(0, 26, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dedos/garras
    for (let i = -1; i <= 1; i++) {
      ctx.fillStyle = '#3A4B18';
      ctx.beginPath();
      ctx.moveTo(i * 3, 28);
      ctx.lineTo(i * 3 - 1, 31);
      ctx.lineTo(i * 3 + 1, 31);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    
    // Perna direita (frente)
    ctx.save();
    ctx.translate(7, 24);
    ctx.rotate(rightLegAngle);
    
    ctx.fillStyle = legGrad;
    ctx.fillRect(-3.5, 0, 7, 26);
    ctx.strokeRect(-3.5, 0, 7, 26);
    
    // Pé
    ctx.fillStyle = '#4B5F20';
    ctx.beginPath();
    ctx.ellipse(0, 26, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dedos
    for (let i = -1; i <= 1; i++) {
      ctx.fillStyle = '#3A4B18';
      ctx.beginPath();
      ctx.moveTo(i * 3, 28);
      ctx.lineTo(i * 3 - 1, 31);
      ctx.lineTo(i * 3 + 1, 31);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  
  drawBackArm(ctx) {
    // Braço segurando o saco (atrás)
    ctx.save();
    ctx.translate(-16, -12);
    const armSwing = Math.sin(this.walkPhase) * 0.15;
    ctx.rotate(-0.6 + armSwing);
    
    const armGrad = ctx.createLinearGradient(-3, 0, 3, 20);
    armGrad.addColorStop(0, '#7FA047');
    armGrad.addColorStop(1, '#556B2F');
    ctx.fillStyle = armGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 10, 5, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Contorno
    ctx.strokeStyle = '#4B5F20';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Mão/garra com 4 dedos
    ctx.fillStyle = '#556B2F';
    ctx.beginPath();
    ctx.arc(0, 22, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Garras longas e pontiagudas
    ctx.strokeStyle = '#3A4B18';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const angle = -0.5 + i * 0.35;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 5, 22 + Math.sin(angle) * 5);
      ctx.lineTo(Math.cos(angle) * 12, 22 + Math.sin(angle) * 12);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  drawFrontArm(ctx) {
    // Braço da frente balançando
    ctx.save();
    ctx.translate(14, -8);
    const armSwing = Math.sin(this.walkPhase + Math.PI) * 0.3;
    ctx.rotate(0.3 + armSwing);
    
    const armGrad = ctx.createLinearGradient(-3, 0, 3, 18);
    armGrad.addColorStop(0, '#8FB84D');
    armGrad.addColorStop(1, '#6B8E23');
    ctx.fillStyle = armGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 9, 5, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#556B2F';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Mão fechada
    ctx.fillStyle = '#6B8E23';
    ctx.beginPath();
    ctx.arc(0, 20, 5.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Dedos curvados
    ctx.strokeStyle = '#4B5F20';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0 + (i - 1) * 2, 22, 3, 0, Math.PI);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

// --- 4. Neve Acumulada (BG) ---
class SnowDrift {
  constructor() {
    this.yBase = canvasBg.height - 60; // Altura base da neve (usa canvasBg)
    this.points = [];
    
    for (let x = -100; x <= canvasBg.width + 100; x += 50) { // Usa canvasBg
      this.points.push({
        x: x,
        y: this.yBase + Math.random() * 20
      });
    }
  }
  
  update() { /* Estático */ }
  
  draw(ctx) { // Recebe o contexto (será ctxBg)
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'white';
    
    ctx.beginPath();
    ctx.moveTo(-100, canvasBg.height + 10); // Canto inferior esquerdo (usa canvasBg)
    ctx.lineTo(-100, this.yBase);
    
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i+1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
    }
    
    ctx.lineTo(canvasBg.width + 100, this.yBase); // Linha até ao fim (usa canvasBg)
    ctx.lineTo(canvasBg.width + 100, canvasBg.height + 10); // Canto inferior direito (usa canvasBg)
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}


// --- FUNÇÕES DE INICIALIZAÇÃO DE TEMA ---

function initChristmas() {
  particlesBg = []; // Partículas para o fundo
  particlesFg = []; // Partículas para a frente (Pai Natal)
  
  // Neve abundante (flocos a cair) -> BG
  const snowflakeCount = 150;
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = new Snowflake();
    snowflake.y = Math.random() * canvasBg.height; // Usa canvasBg
    particlesBg.push(snowflake);
  }
  
  // Luzes de Natal na borda superior -> BG
  const lightSpacing = 40;
  const lightCount = Math.floor(canvasBg.width / lightSpacing) + 2; // Usa canvasBg
  for (let i = 0; i < lightCount; i++) {
    particlesBg.push(new ChristmasLight(i * lightSpacing + 20, i));
  }
  
  // Pai Natal -> FG
  particlesFg.push(new SantaSleigh());
  
  const sleigh2 = new SantaSleigh();
  sleigh2.x = -800; // Começa mais à esquerda
  sleigh2.speed *= 1.2;
  particlesFg.push(sleigh2);
  
  // Grinch a caminhar -> FG (aparece de vez em quando)
  if (Math.random() > 0.3) { // 70% de chance de aparecer
    const grinch = new GrinchWalking();
    grinch.x = canvasFg.width + Math.random() * 400; // Posição inicial aleatória
    particlesFg.push(grinch);
  }
  
  // Adiciona a neve acumulada -> BG
  particlesBg.push(new SnowDrift());
  
  // Inicia AMBOS os loops de animação
  animateBackground(); 
  animateForeground();
}