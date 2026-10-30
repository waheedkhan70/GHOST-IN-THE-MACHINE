/* ==========================================================================
   DIGITAL OFRENDA & SPIRIT ALTAR CONTROLLER (DÍA DE LOS MUERTOS)
   ========================================================================== */

class DigitalOfrenda {
  constructor() {
    this.memorialsContainer = document.getElementById('memorials-grid');
    this.candlesRow = document.getElementById('altar-candles-row');
    this.activeMemorials = [];
    this.storageKey = 'ghost_in_machine_ofrendas';

    this.defaultMemorials = [
      {
        id: 'ada',
        name: 'Augusta Ada Lovelace',
        years: '1815 – 1852',
        role: 'Mother of Computer Programming & The Analytical Engine',
        epitaph: 'She saw beyond mere arithmetic to perceive the poetry of weaving algebraic patterns in machinery.',
        avatar: '🪡',
        offerings: ['🌼 Cempasúchil', '🕯️ Candle of Insight', '📜 Bernoulli Table', '☕ English Tea'],
        isDefault: true
      },
      {
        id: 'grace',
        name: 'Admiral Grace Brewster Hopper',
        years: '1906 – 1992',
        role: 'Compiler Pioneer & Queen of Software',
        epitaph: 'She extracted the moth, taught machines to understand human words, and handed out nanoseconds of truth.',
        avatar: '🦋',
        offerings: ['🌼 Cempasúchil', '🕯️ Candle of Courage', '🧵 Nanosecond Wire', '🍞 Pan de Muerto'],
        isDefault: true
      },
      {
        id: 'turing',
        name: 'Alan Mathison Turing',
        years: '1912 – 1954',
        role: 'Father of Modern Computing & Artificial Intelligence',
        epitaph: 'He broke the uncrackable, dreamed of thinking machines, and laid the mathematical foundations for our era.',
        avatar: '🧠',
        offerings: ['🌼 Cempasúchil', '🕯️ Candle of Truth', '🍎 Symbolic Apple', '📻 Enigma Reel'],
        isDefault: true
      },
      {
        id: 'abandoned-repo',
        name: 'The Forgotten Open-Source Library',
        years: '2008 – 2020',
        role: 'Silent Dependency of 100,000 Production Apps',
        epitaph: 'Maintained by an unthanked solo developer at 2:00 AM on weekends until life moved on. Your code still runs our world.',
        avatar: '💾',
        offerings: ['🌼 Cempasúchil', '🕯️ Perpetual Candle', '💾 Floppy Disk', '☕ Midnight Coffee'],
        isDefault: true
      }
    ];

    this.init();
  }

  init() {
    this.loadMemorials();
    this.renderCandles();
    this.renderMemorials();
    this.bindEvents();
  }

  loadMemorials() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.activeMemorials = [...this.defaultMemorials, ...parsed];
      } else {
        this.activeMemorials = [...this.defaultMemorials];
      }
    } catch (e) {
      this.activeMemorials = [...this.defaultMemorials];
    }
  }

  saveCustomMemorials() {
    try {
      const customOnly = this.activeMemorials.filter(m => !m.isDefault);
      localStorage.setItem(this.storageKey, JSON.stringify(customOnly));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
  }

  renderCandles() {
    if (!this.candlesRow) return;
    this.candlesRow.innerHTML = '';
    const candleCount = 7;
    for (let i = 0; i < candleCount; i++) {
      const isAmber = i % 2 === 1;
      const heightClass = i === 3 ? 'tall' : (i % 2 === 0 ? 'short' : '');
      const unit = document.createElement('div');
      unit.className = 'candle-unit';
      unit.setAttribute('title', 'Click to toggle flame');
      unit.innerHTML = `
        <div class="flame-halo">
          <div class="candle-flame"></div>
        </div>
        <div class="candle-wick"></div>
        <div class="candle-wax ${heightClass} ${isAmber ? 'amber-wax' : ''}"></div>
      `;
      unit.addEventListener('click', () => {
        unit.classList.toggle('extinguished');
        if (window.spectralAudio) {
          if (!unit.classList.contains('extinguished')) {
            window.spectralAudio.playChime(550 + i * 40, 1.5);
          } else {
            window.spectralAudio.playStaticBurst(0.1);
          }
        }
      });
      this.candlesRow.appendChild(unit);
    }
  }

  renderMemorials() {
    if (!this.memorialsContainer) return;
    this.memorialsContainer.innerHTML = '';

    this.activeMemorials.forEach(mem => {
      const card = document.createElement('div');
      card.className = 'memorial-card';
      card.innerHTML = `
        <div class="memorial-header">
          <div class="memorial-portrait-frame">
            <div class="memorial-avatar-icon">${mem.avatar || '🕯️'}</div>
          </div>
          <div class="memorial-info">
            <div class="memorial-name">${this.escapeHtml(mem.name)}</div>
            <div class="memorial-years">${this.escapeHtml(mem.years || '')}</div>
            <div style="font-size:0.75rem; color:var(--spectral-cyan);">${this.escapeHtml(mem.role || '')}</div>
          </div>
        </div>

        <div class="memorial-epitaph">"${this.escapeHtml(mem.epitaph)}"</div>

        <div class="offerings-basket">
          ${mem.offerings.map(o => `<span class="offering-tag">${this.escapeHtml(o)}</span>`).join('')}
        </div>

        <div class="memorial-card-actions">
          <button class="btn-secondary btn-add-offering" data-id="${mem.id}" style="padding:4px 10px; font-size:0.76rem;">
            + Place Offering
          </button>
          <button class="btn-commune" data-id="${mem.id}">
            ✨ Read Blessing
          </button>
        </div>
      `;

      // Event listeners
      card.querySelector('.btn-commune').addEventListener('click', () => this.communeWithMemorial(mem));
      card.querySelector('.btn-add-offering').addEventListener('click', () => this.promptAddOffering(mem));

      this.memorialsContainer.appendChild(card);
    });

    // Update statistics
    const countEl = document.getElementById('stat-memorial-count');
    if (countEl) countEl.textContent = this.activeMemorials.length;
  }

  async communeWithMemorial(mem) {
    if (window.spectralAudio) window.spectralAudio.playChime(480, 2.5);

    const modal = document.getElementById('remembrance-modal');
    const title = document.getElementById('remembrance-modal-title');
    const content = document.getElementById('remembrance-modal-content');

    if (!modal) return;
    title.innerHTML = `✨ Altar Remembrance: ${this.escapeHtml(mem.name)}`;
    content.innerHTML = `<div style="text-align:center; padding:20px; color:var(--spectral-cyan);">Communing with open-weight spectral neural engine...</div>`;
    modal.classList.add('open');

    const eulogy = await window.aiEngine.generateText({
      prompt: `${mem.name} (${mem.years}) - ${mem.role}. Epitaph: ${mem.epitaph}. Offerings: ${mem.offerings.join(', ')}`,
      system: 'OFRENDA_REMEMBRANCE'
    });

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
        <div style="font-size:2.4rem;">${mem.avatar || '🕯️'}</div>
        <div>
          <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.2rem;">${this.escapeHtml(mem.name)}</h3>
          <div style="font-family:var(--font-mono); color:var(--marigold-gold); font-size:0.78rem;">${this.escapeHtml(mem.years || '')}</div>
        </div>
      </div>
      <div class="ai-blessing-box">
        ${this.escapeHtml(eulogy)}
      </div>
      <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
        <button class="btn-secondary" id="btn-copy-remembrance">📋 Copy Remembrance</button>
        <button class="btn-primary" onclick="document.getElementById('remembrance-modal').classList.remove('open')">Accept Blessing</button>
      </div>
    `;

    document.getElementById('btn-copy-remembrance').addEventListener('click', () => {
      navigator.clipboard.writeText(`Remembrance for ${mem.name}:\n\n${eulogy}`);
      if (window.showToast) window.showToast('Remembrance copied to clipboard!', 'cyan');
    });
  }

  promptAddOffering(mem) {
    const offeringTypes = [
      '🌼 Fresh Cempasúchil Petals',
      '🕯️ Votive Candle',
      '🍞 Fresh Pan de Muerto',
      '☕ Clay Cup of Coffee',
      '💾 Floppy Disk Backup',
      '🎶 Favorite Folk Melody',
      '✨ Glass of Pure Water'
    ];
    const picked = offeringTypes[Math.floor(Math.random() * offeringTypes.length)];
    mem.offerings.push(picked);
    this.saveCustomMemorials();
    this.renderMemorials();
    if (window.spectralAudio) window.spectralAudio.playChime(640, 1.2);
    if (window.showToast) window.showToast(`Offered ${picked} to ${mem.name}`, 'amber');
  }

  addCustomMemorial(memorialData) {
    const newMem = {
      id: 'custom-' + Date.now(),
      name: memorialData.name,
      years: memorialData.years,
      role: memorialData.role,
      epitaph: memorialData.epitaph,
      avatar: memorialData.avatar || '🕯️',
      offerings: ['🌼 Cempasúchil', '🕯️ Candle of Love'],
      isDefault: false
    };
    this.activeMemorials.push(newMem);
    this.saveCustomMemorials();
    this.renderMemorials();
    if (window.spectralAudio) window.spectralAudio.playChime(520, 2);
    if (window.showToast) window.showToast(`Memorial for ${newMem.name} placed on the altar`, 'cyan');
  }

  bindEvents() {
    const addBtn = document.getElementById('btn-open-add-memorial');
    const modal = document.getElementById('add-memorial-modal');
    const form = document.getElementById('add-memorial-form');

    if (addBtn && modal) {
      addBtn.addEventListener('click', () => modal.classList.add('open'));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('mem-form-name').value.trim();
        const years = document.getElementById('mem-form-years').value.trim();
        const role = document.getElementById('mem-form-role').value.trim();
        const epitaph = document.getElementById('mem-form-epitaph').value.trim();
        const avatar = document.getElementById('mem-form-avatar').value.trim();

        if (name && epitaph) {
          this.addCustomMemorial({ name, years, role, epitaph, avatar });
          form.reset();
          if (modal) modal.classList.remove('open');
        }
      });
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.digitalOfrenda = new DigitalOfrenda();
});
