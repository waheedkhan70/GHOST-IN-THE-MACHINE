/* ==========================================================================
   PARTICLES CANVAS ATMOSPHERE
   Drifting Cempasúchil (Marigold) Petals & Ethereal Spirit Wisps
   ========================================================================== */

class AtmosphereSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 55;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomY = false) {
    const isPetal = Math.random() > 0.4;
    return {
      type: isPetal ? 'petal' : 'spirit',
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: isPetal ? (6 + Math.random() * 8) : (3 + Math.random() * 6),
      speedY: isPetal ? (0.6 + Math.random() * 1.2) : (0.3 + Math.random() * 0.8),
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: isPetal ? (0.4 + Math.random() * 0.5) : (0.2 + Math.random() * 0.4),
      color: isPetal 
        ? (Math.random() > 0.5 ? '#ff9e00' : '#ff5400')
        : (Math.random() > 0.5 ? '#00f5d4' : '#9d4edd')
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
      p.rotation += p.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;

      if (p.type === 'petal') {
        // Draw marigold petal shape
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Draw soft glowing spirit orb / ectoplasm
        const grad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, p.size * 1.5);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      // Reset when out of view
      if (p.y > this.height + 30 || p.x < -30 || p.x > this.width + 30) {
        this.particles[i] = this.createParticle(false);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.atmosphere = new AtmosphereSystem('particles-canvas');
});
