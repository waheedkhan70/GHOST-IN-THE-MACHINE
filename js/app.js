/* ==========================================================================
   APP ORCHESTRATION & DEV SUBMISSION POST BUILDER
   ========================================================================== */

class AppController {
  constructor() {
    this.currentView = 'terminal';
    this.views = ['terminal', 'ofrenda', 'seance', 'story', 'manifesto'];
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindAudioToggle();
    this.bindEngineSettings();
    this.bindDevPostGenerator();
    this.bindModals();
    this.setupKeyboardShortcuts();

    // Check URL hash
    const hash = window.location.hash.replace('#', '');
    if (this.views.includes(hash)) {
      this.switchView(hash);
    }
  }

  bindNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.getAttribute('data-view');
        if (view) {
          this.switchView(view);
          if (window.spectralAudio) window.spectralAudio.playKeyClick();
        }
      });
    });

    window.switchView = (view) => this.switchView(view);
  }

  switchView(viewName) {
    if (!this.views.includes(viewName)) return;
    this.currentView = viewName;
    window.location.hash = '#' + viewName;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Update view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) targetSec.classList.add('active');

    if (viewName === 'terminal' && window.necroShell && window.necroShell.terminalInput) {
      setTimeout(() => window.necroShell.terminalInput.focus(), 100);
    }
  }

  bindAudioToggle() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      const isSounding = window.spectralAudio.toggleMute();
      audioBtn.classList.toggle('active', isSounding);
      const iconSpan = audioBtn.querySelector('.audio-icon');
      if (iconSpan) {
        iconSpan.textContent = isSounding ? '🔊' : '🔇';
      }
      this.showToast(isSounding ? 'Spectral Audio Awakened' : 'Audio Muted', isSounding ? 'cyan' : 'amber');
    });
  }

  bindEngineSettings() {
    const settingsBtn = document.getElementById('btn-engine-settings');
    const modal = document.getElementById('engine-modal');
    const modeSelect = document.getElementById('ai-engine-mode-select');
    const ollamaUrlInput = document.getElementById('ollama-endpoint-input');
    const btnPingOllama = document.getElementById('btn-ping-ollama');
    const ollamaStatusEl = document.getElementById('ollama-ping-result');
    const badgeText = document.getElementById('header-engine-badge');

    if (settingsBtn && modal) {
      settingsBtn.addEventListener('click', () => modal.classList.add('open'));
    }

    if (modeSelect) {
      modeSelect.addEventListener('change', async (e) => {
        const newMode = e.target.value;
        window.aiEngine.setMode(newMode);
        if (badgeText) {
          const map = {
            instant: 'ENGINE: INSTANT NEURAL',
            ollama: 'ENGINE: OLLAMA LOCAL',
            transformers_web: 'ENGINE: WEBGPU TRANSFORMERS'
          };
          badgeText.textContent = map[newMode] || 'ENGINE: ACTIVE';
        }

        if (newMode === 'transformers_web') {
          this.showToast('Initializing Transformers.js in WebGPU/WASM...', 'cyan');
          try {
            await window.aiEngine.loadTransformersPipeline((pct) => {
              ollamaStatusEl.innerHTML = `<span style="color:var(--spectral-cyan);">Downloading Open Weights: ${pct}%</span>`;
            });
            this.showToast('Transformers.js Model Loaded in Browser!', 'cyan');
            ollamaStatusEl.innerHTML = `<span style="color:var(--phosphor-green)">✓ Qwen1.5-0.5B-Chat Cached Locally</span>`;
          } catch (err) {
            this.showToast('WebGPU load failed; using Instant Fallback', 'amber');
          }
        }
      });
    }

    if (btnPingOllama && ollamaUrlInput) {
      btnPingOllama.addEventListener('click', async () => {
        window.aiEngine.ollamaEndpoint = ollamaUrlInput.value.trim();
        ollamaStatusEl.innerHTML = `<span style="color:var(--text-muted)">Pinging ${window.aiEngine.ollamaEndpoint}...</span>`;
        const res = await window.aiEngine.testOllamaConnection();
        if (res.success) {
          ollamaStatusEl.innerHTML = `<span style="color:var(--phosphor-green)">✓ Connected! Models: ${res.models.slice(0, 3).join(', ')}</span>`;
          this.showToast('Connected to local Ollama!', 'cyan');
        } else {
          ollamaStatusEl.innerHTML = `<span style="color:var(--blood-red)">✗ Failed: ${res.error}. Ensure Ollama is running with OLLAMA_ORIGINS="*"</span>`;
        }
      });
    }
  }

  bindDevPostGenerator() {
    const postModal = document.getElementById('dev-post-modal');
    const openBtn = document.getElementById('btn-open-dev-post');
    const manifestoBtn = document.getElementById('btn-manifesto-open-dev');
    const copyBtn = document.getElementById('btn-copy-dev-post');
    const markdownOutput = document.getElementById('dev-post-markdown');

    const handleOpen = () => {
      const postMarkdown = this.generateDevPostMarkdown();
      if (markdownOutput) markdownOutput.value = postMarkdown;
      if (postModal) postModal.classList.add('open');
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (manifestoBtn) manifestoBtn.addEventListener('click', handleOpen);

    if (copyBtn && markdownOutput) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(markdownOutput.value);
        this.showToast('DEV Submission Post copied to clipboard!', 'cyan');
      });
    }
  }

  generateDevPostMarkdown() {
    return `---
title: Ghost in the Machine: NecroOS & The Digital Ofrenda Powered by Open-Source AI
published: false
description: A cyber-gothic haunted terminal and Dia de los Muertos ofrenda powered entirely by local, open-weight AI models.
tags: devchallenge, opensource, ai, webdev
---

# Ghost in the Machine: NecroOS & The Digital Ofrenda

> *"Between October 31 and November 2, the boundary separating past and present thins to a whisper. Whether that brings to mind things that go bump in the night, ofrendas glowing with candlelight and marigolds, or the memories and stories we carry with us—we built an open-weight sanctuary where technology honors the departed."*

## 🌟 What I Built

**Ghost in the Machine (NecroOS)** is a fully functional cyber-gothic web application that merges Halloween spectral folklore and the rich Día de los Muertos tradition with 100% open-source, local AI inference.

### Core Modules:
1. **The Haunted Terminal (NecroShell)**: An interactive CRT console that simulates spirit possession, intercepts shell commands (\`ls\`, \`cat\`, \`whoami\`, \`kill -9 666\`, \`git blame\`), and whispers eerie commentary using open AI weights.
2. **The Digital Ofrenda (Altar de Muertos)**: A glowing 3-tier altar featuring animated flickering candlelight, cempasúchil marigold garlands, and portraits honoring computing pioneers (Ada Lovelace, Admiral Grace Hopper, Alan Turing, and abandoned open-source libraries). Allows anyone to add personal tributes and receive heartfelt poetic remembrances generated by open-weight models.
3. **Chamber of the Departed (Séance Chatbot)**: An offline communion chamber where users converse with the spirits of departed innovators and lost technologies (Ada Lovelace, Grace Hopper, the immortal ghost of COBOL, and Adobe Flash).
4. **The Ghost Story Weaver**: Analyzes smart home sensor telemetry and git anomalies to weave chilling micro-fiction.
5. **Procedural Spectral Audio Synthesizer**: Built with the native Web Audio API to produce haunted ambient drones, mechanical CRT key clicks, and spirit singing-bowl chimes with zero external audio assets.

---

## 🏛️ Architecture & Open-Source AI Engine

The application was built without relying on closed corporate APIs (like OpenAI or Anthropic). Instead, it runs on a **Triple-Tier Open-Source Engine**:

\`\`\`mermaid
graph TD
    UI[Client Web App: HTML/CSS/JS] --> EngineRouter[Open-Source AI Engine Router]
    EngineRouter -->|Tier 1: In-Browser WebGPU/WASM| TransformersJS[Transformers.js / ONNX Runtime]
    TransformersJS --> OpenWeights[Cached Weights: SmolLM2 / Qwen1.5 / GPT-2]
    EngineRouter -->|Tier 2: Localhost Daemon| Ollama[Local Ollama / LM Studio: Llama 3.2, Mistral]
    EngineRouter -->|Tier 3: Zero-Latency Fallback| InstantNeural[Spectral Neural Markov Core]
\`\`\`

1. **Transformers.js (Hugging Face)**: Executes open weights directly inside the client browser via WebGPU / WebAssembly with zero roundtrips.
2. **Local Ollama Bridge**: Connects directly to local Ollama (\`http://localhost:11434\`) running models like \`llama3.2:1b\` or \`mistral\`.
3. **Instant Spectral Neural Fallback**: Ensures instant interactivity on any machine without setup delays.

---

## 💡 Why Open Innovation Matters for What I Built

### 1. Air-Gapped Privacy for Personal Grief
An ofrenda is deeply personal. Users write memories of late grandparents, mentors, and loved ones. Feeding family memories into proprietary cloud LLMs exposes intimate grief to data harvesters and advertising profiles. By keeping inference completely on-device, your ancestral remembrances never leave your room.

### 2. Perpetual Existence (No SaaS Sunset)
We saw millions of interactive cultural works disappear when Adobe Flash was killed, and we see web tools vanish whenever a startup pivots or raises API prices. Open weights stored in standard ONNX/GGUF formats can be executed 20, 50, or 100 years from now. Open source is the only guarantee that cultural memory survives.

### 3. Runs Completely Offline
During storms, power outages, or in remote cabins with no internet, NecroOS boots instantly and runs with the lights (and WiFi) turned off.

---

## 🛠️ Tech Stack
- **Structure**: Semantic HTML5 with accessibility tags and custom data attributes.
- **Styling**: Pure Vanilla CSS featuring curated HSL tokens, CRT phosphor effects, glassmorphic blur, and fluid keyframe animations.
- **Logic**: Vanilla JavaScript (ES6+ modular architecture).
- **Audio**: Procedural synthesis via the native browser Web Audio API.
- **Inference**: Transformers.js, Ollama REST API, and local browser storage.
`;
  }

  bindModals() {
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey) {
        if (e.key === '1') { e.preventDefault(); this.switchView('terminal'); }
        if (e.key === '2') { e.preventDefault(); this.switchView('ofrenda'); }
        if (e.key === '3') { e.preventDefault(); this.switchView('seance'); }
        if (e.key === '4') { e.preventDefault(); this.switchView('story'); }
        if (e.key === '5') { e.preventDefault(); this.switchView('manifesto'); }
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          document.getElementById('btn-audio-toggle')?.click();
        }
      }
    });
  }

  showToast(message, theme = 'amber') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${theme}`;
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  window.showToast = (msg, theme) => window.appController.showToast(msg, theme);
});
