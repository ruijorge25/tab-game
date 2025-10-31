/**
 * Sistema de Animações Premium com Canvas
 * Gestão de efeitos visuais para cada tema
 */

let canvas = null;
let ctx = null;
let animationFrame = null;
let particles = [];
let currentTheme = null;

/**
 * Inicializa o canvas de animações
 */
export function initAnimationCanvas() {
  // Remove canvas anterior se existir
  if (canvas) {
    canvas.remove();
  }

  canvas = document.createElement('canvas');
  canvas.id = 'animation-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

/**
 * Ajusta tamanho do canvas
 */
function resizeCanvas() {
  if (!canvas) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Limpa após resize
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Para todas as animações
 */
export function stopAnimations() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  particles = [];
  currentTheme = null;
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Inicia animações baseadas no tema
 */
export function startThemeAnimation(theme) {
  stopAnimations();
  currentTheme = theme;
  
  if (!canvas) {
    initAnimationCanvas();
  }
  
  // Limpa o canvas completamente
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  // Se for tema desert (sem animações), apenas para aqui
  if (theme === 'desert') {
    return;
  }
  
  // Aguarda um frame antes de iniciar as animações
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
// DESERT NIGHT - Céu Estrelado Profissional
// ============================================

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 0.7; // Só na parte superior
    this.radius = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }
  
  update() {
    this.twinklePhase += this.twinkleSpeed;
    this.opacity = 0.3 + Math.sin(this.twinklePhase) * 0.4;
  }
  
  draw() {
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
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 0.5;
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
    if (this.opacity <= 0 || this.x > canvas.width + 100 || this.y > canvas.height + 100) {
      // Chance de reaparecer
      if (Math.random() < 0.01) {
        this.reset();
      }
    }
  }
  
  draw() {
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
  particles = [];
  
  // Criar estrelas fixas (150-200)
  const starCount = 150 + Math.floor(Math.random() * 50);
  for (let i = 0; i < starCount; i++) {
    particles.push(new Star());
  }
  
  // Criar 3-5 estrelas cadentes
  const shootingStarCount = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < shootingStarCount; i++) {
    particles.push(new ShootingStar());
  }
  
  animateDesertNight();
}

function animateDesertNight() {
  if (currentTheme !== 'desert-night') return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  animationFrame = requestAnimationFrame(animateDesertNight);
}

// ============================================
// HALLOWEEN - Partículas Místicas + Atmosfera
// ============================================

class MysticParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
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
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.life = this.maxLife;
      this.opacity = Math.random() * 0.3 + 0.2;
    }
  }
  
  draw() {
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
    this.x = side > 0 ? -50 : canvas.width + 50;
    this.y = Math.random() * (canvas.height * 0.6) + 50;
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
    
    // Fade in/out
    if (this.fadeIn) {
      this.opacity += 0.02;
      if (this.opacity >= 0.6) this.fadeIn = false;
    }
    
    // Movimento errático ocasional
    if (Math.random() < 0.02) {
      this.vy += (Math.random() - 0.5) * 1;
    }
    
    // Reset quando sair
    if (this.x < -100 || this.x > canvas.width + 100) {
      this.reset();
    }
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size, this.size);
    ctx.globalAlpha = this.opacity;
    
    const wingAngle = Math.sin(this.wingPhase) * 0.5;
    
    // Corpo
    ctx.fillStyle = '#1a0033';
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
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// Abóbora realista Jack-o'-lantern (estilo 3D profissional)
class Pumpkin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.glowPhase = Math.random() * Math.PI * 2;
    this.glowSpeed = 0.03;
    this.flickerPhase = 0;
    this.size = 100; // Bem grande
  }
  
  update() {
    this.glowPhase += this.glowSpeed;
    this.flickerPhase += 0.15;
  }
  
  draw() {
    const glow = 0.8 + Math.sin(this.glowPhase) * 0.2;
    const flicker = 0.9 + Math.sin(this.flickerPhase) * 0.1; // Efeito de chama
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Sombra realista no chão
    const shadowGradient = ctx.createRadialGradient(0, this.size * 0.6, 0, 0, this.size * 0.6, this.size * 0.5);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.ellipse(0, this.size * 0.6, this.size * 0.45, this.size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // GOMOS DA ABÓBORA (8 segmentos 3D)
    const segments = 8;
    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 * i) / segments - Math.PI / 2;
      const nextAngle = (Math.PI * 2 * (i + 1)) / segments - Math.PI / 2;
      const midAngle = (angle + nextAngle) / 2;
      
      // Gradiente radial para cada gomo (3D)
      const segmentGradient = ctx.createRadialGradient(
        Math.cos(midAngle) * this.size * 0.15, 
        Math.sin(midAngle) * this.size * 0.1, 
        0,
        0, 0, this.size * 0.52
      );
      
      // Cores alternadas para profundidade
      if (i % 2 === 0) {
        segmentGradient.addColorStop(0, '#ff9d42');
        segmentGradient.addColorStop(0.4, '#ff7f1e');
        segmentGradient.addColorStop(0.8, '#e85d04');
        segmentGradient.addColorStop(1, '#b34400');
      } else {
        segmentGradient.addColorStop(0, '#ff8c2a');
        segmentGradient.addColorStop(0.4, '#ff6b0a');
        segmentGradient.addColorStop(0.8, '#d84000');
        segmentGradient.addColorStop(1, '#a03800');
      }
      
      ctx.fillStyle = segmentGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.size * 0.5, angle, nextAngle);
      ctx.closePath();
      ctx.fill();
    }
    
    // Linhas profundas entre gomos
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 3;
    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 * i) / segments - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * this.size * 0.5, Math.sin(angle) * this.size * 0.5);
      ctx.stroke();
    }
    
    // Linhas secundárias (textura)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < segments * 2; i++) {
      const angle = (Math.PI * 2 * i) / (segments * 2) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * this.size * 0.15, Math.sin(angle) * this.size * 0.15);
      ctx.lineTo(Math.cos(angle) * this.size * 0.48, Math.sin(angle) * this.size * 0.48);
      ctx.stroke();
    }
    
    // TALO REALISTA 3D
    const stemGradient = ctx.createLinearGradient(-10, -this.size * 0.6, 10, -this.size * 0.5);
    stemGradient.addColorStop(0, '#2d5016');
    stemGradient.addColorStop(0.5, '#3d6b1f');
    stemGradient.addColorStop(1, '#1a3009');
    
    ctx.fillStyle = stemGradient;
    ctx.strokeStyle = '#0d1a04';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(-10, -this.size * 0.48);
    ctx.quadraticCurveTo(-12, -this.size * 0.58, -8, -this.size * 0.68);
    ctx.quadraticCurveTo(-4, -this.size * 0.72, 0, -this.size * 0.7);
    ctx.quadraticCurveTo(4, -this.size * 0.72, 8, -this.size * 0.68);
    ctx.quadraticCurveTo(12, -this.size * 0.58, 10, -this.size * 0.48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Texturas no talo
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const yPos = -this.size * 0.5 - i * 4;
      ctx.beginPath();
      ctx.moveTo(-6, yPos);
      ctx.lineTo(-4, yPos - 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(4, yPos);
      ctx.lineTo(6, yPos - 2);
      ctx.stroke();
    }
    
    // BRILHO INTERNO FORTE (como vela dentro)
    const innerGlow = glow * flicker;
    
    // Glow laranja forte irradiando
    const glowRadius = this.size * 0.6;
    const glowGradient = ctx.createRadialGradient(0, 5, 0, 0, 5, glowRadius);
    glowGradient.addColorStop(0, `rgba(255, 200, 0, ${innerGlow * 0.8})`);
    glowGradient.addColorStop(0.3, `rgba(255, 140, 0, ${innerGlow * 0.5})`);
    glowGradient.addColorStop(0.6, `rgba(255, 100, 0, ${innerGlow * 0.2})`);
    glowGradient.addColorStop(1, 'rgba(255, 80, 0, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 5, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // OLHOS TRIANGULARES BRILHANTES
    ctx.shadowBlur = 30 * innerGlow;
    ctx.shadowColor = '#ffaa00';
    
    // Olho esquerdo (maior e mais assustador)
    const eyeGradientL = ctx.createRadialGradient(-18, -15, 0, -18, -15, 15);
    eyeGradientL.addColorStop(0, '#ffff00');
    eyeGradientL.addColorStop(0.4, '#ffdd00');
    eyeGradientL.addColorStop(0.7, '#ffaa00');
    eyeGradientL.addColorStop(1, '#ff8800');
    
    ctx.fillStyle = eyeGradientL;
    ctx.beginPath();
    ctx.moveTo(-28, -10);
    ctx.lineTo(-18, -28);
    ctx.lineTo(-8, -10);
    ctx.closePath();
    ctx.fill();
    
    // Brilho intenso no centro do olho esquerdo
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = innerGlow;
    ctx.beginPath();
    ctx.arc(-18, -16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Olho direito
    const eyeGradientR = ctx.createRadialGradient(18, -15, 0, 18, -15, 15);
    eyeGradientR.addColorStop(0, '#ffff00');
    eyeGradientR.addColorStop(0.4, '#ffdd00');
    eyeGradientR.addColorStop(0.7, '#ffaa00');
    eyeGradientR.addColorStop(1, '#ff8800');
    
    ctx.fillStyle = eyeGradientR;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(18, -28);
    ctx.lineTo(28, -10);
    ctx.closePath();
    ctx.fill();
    
    // Brilho intenso no centro do olho direito
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = innerGlow;
    ctx.beginPath();
    ctx.arc(18, -16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // NARIZ TRIANGULAR BRILHANTE
    const noseGradient = ctx.createRadialGradient(0, -2, 0, 0, -2, 10);
    noseGradient.addColorStop(0, '#ffff00');
    noseGradient.addColorStop(0.5, '#ffcc00');
    noseGradient.addColorStop(1, '#ff9900');
    
    ctx.fillStyle = noseGradient;
    ctx.beginPath();
    ctx.moveTo(-8, 5);
    ctx.lineTo(0, -10);
    ctx.lineTo(8, 5);
    ctx.closePath();
    ctx.fill();
    
    // BOCA ASSUSTADORA EM ZIGZAG COM BRILHO
    const mouthGradient = ctx.createRadialGradient(0, 20, 0, 0, 20, 25);
    mouthGradient.addColorStop(0, '#ffff00');
    mouthGradient.addColorStop(0.3, '#ffdd00');
    mouthGradient.addColorStop(0.6, '#ffaa00');
    mouthGradient.addColorStop(1, '#ff8800');
    
    ctx.fillStyle = mouthGradient;
    ctx.beginPath();
    
    // Boca em zigzag (dentes afiados)
    ctx.moveTo(-30, 15);
    ctx.lineTo(-24, 25);
    ctx.lineTo(-18, 15);
    ctx.lineTo(-12, 28);
    ctx.lineTo(-6, 15);
    ctx.lineTo(0, 30);
    ctx.lineTo(6, 15);
    ctx.lineTo(12, 28);
    ctx.lineTo(18, 15);
    ctx.lineTo(24, 25);
    ctx.lineTo(30, 15);
    ctx.lineTo(25, 18);
    ctx.lineTo(0, 18);
    ctx.lineTo(-25, 18);
    ctx.closePath();
    ctx.fill();
    
    // Brilho extra na boca
    ctx.fillStyle = '#ffff00';
    ctx.globalAlpha = innerGlow * 0.4;
    ctx.beginPath();
    ctx.arc(0, 22, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // RAIOS DE LUZ saindo dos olhos e boca (efeito dramático)
    ctx.strokeStyle = `rgba(255, 200, 0, ${innerGlow * 0.6})`;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    
    // Raios do olho esquerdo
    for (let i = 0; i < 4; i++) {
      const rayAngle = -Math.PI / 3 - i * 0.15;
      ctx.beginPath();
      ctx.moveTo(-18, -18);
      ctx.lineTo(-18 + Math.cos(rayAngle) * 25, -18 + Math.sin(rayAngle) * 25);
      ctx.stroke();
    }
    
    // Raios do olho direito
    for (let i = 0; i < 4; i++) {
      const rayAngle = -Math.PI * 2 / 3 + i * 0.15;
      ctx.beginPath();
      ctx.moveTo(18, -18);
      ctx.lineTo(18 + Math.cos(rayAngle) * 25, -18 + Math.sin(rayAngle) * 25);
      ctx.stroke();
    }
    
    // Raios da boca
    ctx.strokeStyle = `rgba(255, 180, 0, ${innerGlow * 0.4})`;
    for (let i = -2; i <= 2; i++) {
      const rayAngle = Math.PI / 2 + i * 0.2;
      ctx.beginPath();
      ctx.moveTo(0, 25);
      ctx.lineTo(Math.cos(rayAngle) * 20, 25 + Math.sin(rayAngle) * 20);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

// Névoa
class Fog {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height * 0.7 + Math.random() * canvas.height * 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 150 + 100;
    this.opacity = Math.random() * 0.15 + 0.1;
  }
  
  update() {
    this.x += this.vx;
    
    if (this.x < -this.size) this.x = canvas.width + this.size;
    if (this.x > canvas.width + this.size) this.x = -this.size;
  }
  
  draw() {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, `rgba(147, 112, 219, ${this.opacity})`);
    gradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
  }
}

let lightningTimer = 0;
let lightningFlash = false;

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
    const startX = Math.random() * canvas.width;
    const startY = 0;
    const endY = canvas.height * 0.7;
    
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
  
  draw() {
    if (!this.active) return;
    
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Flash de fundo
    const bgFlash = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    bgFlash.addColorStop(0, 'rgba(147, 112, 219, 0.3)');
    bgFlash.addColorStop(1, 'rgba(147, 112, 219, 0)');
    ctx.fillStyle = bgFlash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
  particles = [];
  
  // Partículas místicas
  for (let i = 0; i < 30; i++) {
    particles.push(new MysticParticle());
  }
  
  // Morcegos
  for (let i = 0; i < 4; i++) {
    particles.push(new Bat());
  }
  
  // Uma abóbora GIGANTE e super realista no canto inferior direito (mais embaixo)
  particles.push(new Pumpkin(canvas.width - 100, canvas.height - 80));
  
  // Névoa
  for (let i = 0; i < 5; i++) {
    particles.push(new Fog());
  }
  
  lightning = new Lightning();
  lightningTimer = 0;
  
  animateHalloween();
}

function animateHalloween() {
  if (currentTheme !== 'halloween') return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Relâmpago ocasional
  lightningTimer++;
  if (lightningTimer > 400 && Math.random() < 0.008) {
    lightning.trigger();
    lightningTimer = 0;
  }
  
  // Desenhar relâmpago primeiro (fundo)
  lightning.update();
  lightning.draw();
  
  // Depois outras partículas
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  animationFrame = requestAnimationFrame(animateHalloween);
}

// ============================================
// CHRISTMAS - Neve + Luzes + Pai Natal com Renas
// ============================================

class Snowflake {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.radius = Math.random() * 4 + 2; // Neve maior e mais visível
    this.speed = Math.random() * 1.5 + 0.8;
    this.wind = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.5 + 0.5; // Mais opaca
    this.swingSpeed = Math.random() * 0.03 + 0.01;
    this.swingPhase = Math.random() * Math.PI * 2;
  }
  
  update() {
    this.y += this.speed;
    this.swingPhase += this.swingSpeed;
    this.x += Math.sin(this.swingPhase) * 0.8 + this.wind;
    
    if (this.y > canvas.height + 10) {
      this.reset();
    }
    
    if (this.x > canvas.width + 10) this.x = -10;
    if (this.x < -10) this.x = canvas.width + 10;
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    
    // Floco de neve simples e bonito
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

// String Lights na borda inferior
class ChristmasLight {
  constructor(x, index) {
    this.x = x;
    this.y = canvas.height - 30; // Bem na borda inferior
    this.index = index;
    this.colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff'];
    this.color = this.colors[index % this.colors.length];
    this.glowPhase = Math.random() * Math.PI * 2;
    this.glowSpeed = 0.06 + Math.random() * 0.04;
    this.baseRadius = 6;
  }
  
  update() {
    this.glowPhase += this.glowSpeed;
  }
  
  draw() {
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

// Pai Natal no trenó com renas
class SantaSleigh {
  constructor() {
    this.reset();
  }
  
  reset() {
    // Começa fora da tela à esquerda
    this.x = -300;
    this.y = Math.random() * (canvas.height * 0.4) + 80;
    this.speed = 3 + Math.random() * 2;
    this.wavePhase = 0;
    this.waveSpeed = 0.05;
    this.scale = 0.8 + Math.random() * 0.4;
  }
  
  update() {
    this.x += this.speed;
    this.wavePhase += this.waveSpeed;
    
    // Movimento ondulatório suave
    this.y += Math.sin(this.wavePhase) * 0.5;
    
    // Reset quando sair completamente
    if (this.x > canvas.width + 300) {
      this.reset();
    }
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = 0.9;
    
    // Renas (3 renas)
    for (let i = 0; i < 3; i++) {
      const offsetX = i * -60;
      const jumpPhase = this.wavePhase + i * 0.5;
      const jumpY = Math.sin(jumpPhase * 2) * 8;
      
      this.drawReindeer(offsetX, jumpY);
    }
    
    // Trenó
    this.drawSleigh(-40, 0);
    
    // Pai Natal
    this.drawSanta(0, -10);
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  
  drawReindeer(x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    // Corpo da rena
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça
    ctx.beginPath();
    ctx.ellipse(-18, -8, 10, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Chifres
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, -14);
    ctx.lineTo(-22, -20);
    ctx.lineTo(-19, -18);
    ctx.moveTo(-20, -14);
    ctx.lineTo(-17, -19);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.lineTo(-14, -20);
    ctx.lineTo(-17, -18);
    ctx.moveTo(-16, -14);
    ctx.lineTo(-13, -19);
    ctx.stroke();
    
    // Nariz vermelho (Rudolph!)
    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.arc(-25, -8, 3, 0, Math.PI * 2);
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
    
    // Cauda
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, -2);
    ctx.lineTo(25, -5);
    ctx.stroke();
    
    ctx.restore();
  }
  
  drawSleigh(x, y) {
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
  
  drawSanta(x, y) {
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

function initChristmas() {
  particles = [];
  
  // Neve abundante (branca e visível)
  const snowflakeCount = 150;
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = new Snowflake();
    snowflake.y = Math.random() * canvas.height;
    particles.push(snowflake);
  }
  
  // Luzes de Natal na borda inferior
  const lightSpacing = 40;
  const lightCount = Math.floor(canvas.width / lightSpacing) + 2;
  for (let i = 0; i < lightCount; i++) {
    particles.push(new ChristmasLight(i * lightSpacing + 20, i));
  }
  
  // Pai Natal com trenó e renas (2 para aparecer mais vezes)
  particles.push(new SantaSleigh());
  
  // Segundo trenó com delay
  const sleigh2 = new SantaSleigh();
  sleigh2.x = -800; // Começa mais atrás
  sleigh2.speed *= 1.2; // Um pouco mais rápido
  particles.push(sleigh2);
  
  animateChristmas();
}

function animateChristmas() {
  if (currentTheme !== 'christmas') return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Ordem: neve -> trenós -> luzes (para luzes ficarem em frente)
  particles.filter(p => p instanceof Snowflake).forEach(p => { p.update(); p.draw(); });
  particles.filter(p => p instanceof SantaSleigh).forEach(p => { p.update(); p.draw(); });
  
  // Cabo das luzes na borda inferior
  ctx.strokeStyle = 'rgba(40, 40, 40, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 30);
  ctx.lineTo(canvas.width, canvas.height - 30);
  ctx.stroke();
  
  // Luzes por último (sempre visíveis)
  particles.filter(p => p instanceof ChristmasLight).forEach(p => { p.update(); p.draw(); });
  
  animationFrame = requestAnimationFrame(animateChristmas);
}

