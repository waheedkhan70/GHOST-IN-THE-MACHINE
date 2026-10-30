/* ==========================================================================
   OFFLINE SÉANCE CHAMBER CONTROLLER
   Commune with departed computing spirits and programming languages
   ========================================================================== */

class SeanceChamber {
  constructor() {
    this.spiritRosterContainer = document.getElementById('spirit-roster');
    this.messagesStream = document.getElementById('seance-messages-stream');
    this.inputForm = document.getElementById('seance-input-form');
    this.textField = document.getElementById('seance-text-field');
    this.currentSpiritName = document.getElementById('current-spirit-name');
    this.currentSpiritDomain = document.getElementById('current-spirit-domain');

    this.spirits = [
      {
        id: 'ada',
        name: 'Ada Lovelace',
        era: '1815 – 1852',
        domain: 'Poetic Science & Analytical Computation',
        avatar: '🪡',
        accentColor: '#00f5d4',
        initialGreeting: "Greetings across the temporal divide. The machine does not originate; it weaves what we know how to order. How do your open models weave humanity's thought today?"
      },
      {
        id: 'grace',
        name: 'Admiral Grace Hopper',
        era: '1906 – 1992',
        domain: 'Compilers, Nanoseconds & Bug Hunting',
        avatar: '🦋',
        accentColor: '#ff9e00',
        initialGreeting: "Ahoy there! If you want to accomplish anything in computing, you have to be willing to beg for forgiveness instead of asking for permission. Why let a cloud vendor hold your keys when you can run open models right on your deck?"
      },
      {
        id: 'cobol',
        name: 'The Ghost of COBOL',
        era: '1959 – Present',
        domain: 'Monolithic Mainframe Immortality',
        avatar: '🏛️',
        accentColor: '#39ff14',
        initialGreeting: "IDENTIFICATION DIVISION. I was compiled in 1959, and I am still processing your wire transfers today. The ephemeral cloud frameworks of your youth have turned to rust, yet I endure. What brings you to the sacred monolith?"
      },
      {
        id: 'flash',
        name: 'The Spirit of Adobe Flash',
        era: '1996 – 2020',
        domain: 'Vector Dreams & The Open Wild Web',
        avatar: '⚡',
        accentColor: '#ff5400',
        initialGreeting: "*ActionScript 2.0 static burst*... I gave millions of kids their first canvas to animate, compose music, and make games with zero gatekeepers. When proprietary forces decreed my execution, an entire cultural era vanished. You must protect open-source AI so your art is never locked away!"
      },
      {
        id: 'lisp',
        name: 'The Soul of LISP',
        era: '1958 – Eternity',
        domain: 'Symbolic Consciousness & Lambda Calculus',
        avatar: 'λ',
        accentColor: '#9d4edd',
        initialGreeting: "(defun welcome (mortal)\n  (princ \"You speak to the primordial root of artificial intellect.\")\n  (eval (quote (WHAT-IS-TRUTH))))\nAll neural networks are but grand approximations of our recursive dream. Speak."
      }
    ];

    this.activeSpirit = this.spirits[0];
    this.conversationHistory = {};

    this.init();
  }

  init() {
    this.renderRoster();
    this.selectSpirit(this.spirits[0].id);
    this.bindEvents();
  }

  renderRoster() {
    if (!this.spiritRosterContainer) return;
    this.spiritRosterContainer.innerHTML = '';

    this.spirits.forEach(s => {
      const card = document.createElement('div');
      card.className = `spirit-select-card ${s.id === this.activeSpirit.id ? 'active' : ''}`;
      card.setAttribute('data-id', s.id);
      card.innerHTML = `
        <div class="spirit-avatar">${s.avatar}</div>
        <div class="spirit-meta">
          <div class="spirit-name">${s.name}</div>
          <div class="spirit-era">${s.era}</div>
          <div class="spirit-domain">${s.domain}</div>
        </div>
      `;
      card.addEventListener('click', () => this.selectSpirit(s.id));
      this.spiritRosterContainer.appendChild(card);
    });
  }

  selectSpirit(spiritId) {
    const found = this.spirits.find(s => s.id === spiritId);
    if (!found) return;

    this.activeSpirit = found;

    // Update UI headers
    if (this.currentSpiritName) this.currentSpiritName.textContent = found.name;
    if (this.currentSpiritDomain) this.currentSpiritDomain.textContent = `${found.domain} (${found.era})`;

    // Highlight active in roster
    document.querySelectorAll('.spirit-select-card').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-id') === spiritId);
    });

    if (window.spectralAudio) {
      window.spectralAudio.playChime(420, 1.8);
      window.spectralAudio.playStaticBurst(0.25);
    }

    // Initialize or load conversation history
    if (!this.conversationHistory[spiritId]) {
      this.conversationHistory[spiritId] = [
        { sender: 'spirit', author: found.name, text: found.initialGreeting }
      ];
    }

    this.renderMessages();
  }

  renderMessages() {
    if (!this.messagesStream) return;
    this.messagesStream.innerHTML = '';

    const list = this.conversationHistory[this.activeSpirit.id] || [];
    list.forEach(m => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${m.sender}`;
      bubble.setAttribute('data-author', m.author || (m.sender === 'user' ? 'YOU' : this.activeSpirit.name));
      bubble.textContent = m.text;
      this.messagesStream.appendChild(bubble);
    });

    this.messagesStream.scrollTop = this.messagesStream.scrollHeight;
  }

  bindEvents() {
    if (this.inputForm && this.textField) {
      this.inputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = this.textField.value.trim();
        if (!text) return;

        // Add user message
        const hist = this.conversationHistory[this.activeSpirit.id];
        hist.push({ sender: 'user', author: 'YOU', text });
        this.textField.value = '';
        this.renderMessages();

        if (window.spectralAudio) window.spectralAudio.playKeyClick();

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-bubble spirit';
        typingIndicator.setAttribute('data-author', this.activeSpirit.name);
        typingIndicator.innerHTML = '<em>*The spirit enters the transmission coil...*</em>';
        this.messagesStream.appendChild(typingIndicator);
        this.messagesStream.scrollTop = this.messagesStream.scrollHeight;

        // Generate response via Open-Source AI Engine
        const reply = await window.aiEngine.generateText({
          prompt: text,
          spiritContext: this.activeSpirit
        });

        // Remove indicator and record message
        typingIndicator.remove();
        hist.push({ sender: 'spirit', author: this.activeSpirit.name, text: reply });
        this.renderMessages();

        if (window.spectralAudio) window.spectralAudio.playStaticBurst(0.2);
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.seanceChamber = new SeanceChamber();
});
