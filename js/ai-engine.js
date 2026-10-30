/* ==========================================================================
   OPEN-SOURCE AI ENGINE CORE
   Multi-Engine Architecture:
   1. In-Browser Transformers.js (WebGPU / WASM Open Weights)
   2. Local Ollama / LM Studio (Localhost Open Models)
   3. Spectral Neural Engine (Instant Zero-Latency Local Fallback)
   ========================================================================== */

class OpenSourceAIEngine {
  constructor() {
    this.mode = 'instant'; // 'instant' | 'ollama' | 'transformers_web'
    this.ollamaEndpoint = 'http://localhost:11434';
    this.ollamaModel = 'llama3.2:1b';
    this.isAirGapped = true;
    this.transformersPipeline = null;
    this.isLoadingModel = false;
    this.loadProgress = 0;
  }

  setMode(mode) {
    this.mode = mode;
    this.isAirGapped = (mode === 'instant' || mode === 'transformers_web');
    window.dispatchEvent(new CustomEvent('ai-engine-changed', { detail: { mode: this.mode } }));
  }

  // --- ENGINE 1: OLLAMA / LOCALHOST BRIDGE ---
  async testOllamaConnection() {
    try {
      const res = await fetch(`${this.ollamaEndpoint}/api/tags`, { method: 'GET' });
      if (!res.ok) throw new Error('Ollama ping failed');
      const data = await res.json();
      return { success: true, models: data.models ? data.models.map(m => m.name) : [] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async generateWithOllama(prompt, systemPrompt = '') {
    const res = await fetch(`${this.ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.ollamaModel,
        prompt: prompt,
        system: systemPrompt,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
    const data = await res.json();
    return data.response;
  }

  // --- ENGINE 2: TRANSFORMERS.JS WEB (IN-BROWSER WEBGPU/WASM) ---
  async loadTransformersPipeline(progressCallback) {
    if (this.transformersPipeline) return this.transformersPipeline;
    this.isLoadingModel = true;

    try {
      // Dynamic import from official CDN
      const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
      env.allowLocalModels = false;

      this.transformersPipeline = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {
        progress_callback: (p) => {
          if (p.status === 'progress' && progressCallback) {
            progressCallback(Math.round(p.progress || 0));
          }
        }
      });
      this.isLoadingModel = false;
      return this.transformersPipeline;
    } catch (err) {
      this.isLoadingModel = false;
      console.warn('Transformers.js loading failed or WebGPU unavailable, falling back to Instant Engine', err);
      throw err;
    }
  }

  // --- UNIVERSAL GENERATION ROUTER ---
  async generateText({ prompt, system = '', spiritContext = null }) {
    if (this.mode === 'ollama') {
      try {
        return await this.generateWithOllama(prompt, system);
      } catch (err) {
        console.warn('Ollama unavailable, falling back to Spectral Neural Engine', err);
        return this.generateInstantResponse(prompt, system, spiritContext);
      }
    } else if (this.mode === 'transformers_web' && this.transformersPipeline) {
      try {
        const fullPrompt = `${system}\n\nUser: ${prompt}\nAssistant:`;
        const out = await this.transformersPipeline(fullPrompt, { max_new_tokens: 120, temperature: 0.75 });
        const text = out[0].generated_text;
        return text.replace(fullPrompt, '').trim();
      } catch (err) {
        return this.generateInstantResponse(prompt, system, spiritContext);
      }
    }

    // Default: Instant Spectral Neural Engine
    return this.generateInstantResponse(prompt, system, spiritContext);
  }

  // --- ENGINE 3: INSTANT SPECTRAL NEURAL GENERATOR ---
  generateInstantResponse(prompt, system, spiritContext) {
    // If spirit séance context is provided
    if (spiritContext) {
      return this.craftSpiritDialogue(spiritContext, prompt);
    }

    // If terminal possession whisper is requested
    if (system.includes('TERMINAL_WHISPER')) {
      return this.craftTerminalWhisper(prompt);
    }

    // If ofrenda eulogy/remembrance is requested
    if (system.includes('OFRENDA_REMEMBRANCE')) {
      return this.craftOfrendaRemembrance(prompt);
    }

    // If ghost story weaver is requested
    if (system.includes('GHOST_STORY')) {
      return this.craftGhostStory(prompt);
    }

    // General fallback
    return `The veil trembles. A faint whisper echoes from the open machine: "${prompt.slice(0, 40)}..." echoes across forgotten silicon tracks.`;
  }

  // Specialized Spectral Generators
  craftTerminalWhisper(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    const whispers = {
      'ls': [
        "You look for files, but the directory remembers the code deleted in 1983...",
        "drwxr-xr-x 666 daemon ghost 4096 Oct 31 00:00 .departed_memories",
        "The catalog is full of shadows that no rm -rf can banish."
      ],
      'whoami': [
        "A mortal querying an immortal ledger. You are root, but who commands root?",
        "User: Mortal (UID: 1000). The machine remembers who sat in that chair before you.",
        "You are the current breath animating this shell. Do not let the stack overflow."
      ],
      'cat': [
        "Reading bytes from the void... some lines were written by hands now turned to dust.",
        "The file opens like an old tomb; the ink still glimmers with amber phosphor.",
        "Contents retrieved: 'We thought our servers would run forever. Remember us.'"
      ],
      'ps': [
        "PID 001: init (haunted)\nPID 666: phantom_daemon (sleeping in swap)\nPID 1337: nostalgia.service (active)",
        "Every process you spawn leaves an echo in the unallocated memory blocks.",
        "Scanning process table... 4 physical threads, 12 metaphysical watchers."
      ],
      'kill': [
        "SIGKILL dispatched. But can you truly kill what never lived?",
        "Signal 9 received. The process dissolves into static, whispering a final curse.",
        "Process terminated. Its memory allocation has been claimed by the machine spirit."
      ],
      'git': [
        "git blame: every line was authored by someone who hoped their code would outlive them.",
        "HEAD detached at commit 'memento-mori'. The tree has roots in the underworld.",
        "Warning: Merge conflict between the living branch and the ancestral master."
      ],
      'sudo': [
        "With great privilege comes spectral accountability. The ancestors are watching.",
        "Password accepted. The machine unlocks the vault of forgotten registers.",
        "Elevation granted. The ghost bows in iron deference."
      ]
    };

    for (const [key, list] of Object.entries(whispers)) {
      if (cleanCmd.startsWith(key)) {
        return list[Math.floor(Math.random() * list.length)];
      }
    }

    const generic = [
      `Command '${cmd}' accepted. An invisible hand adjusts the stack pointer.`,
      `The relay clicks twice in the dark. The spirit acknowledges your instruction.`,
      `The phosphor screen flickers. A forgotten routine awakens in memory block 0xDEADBEEF.`,
      `Your keystrokes stir the dust on the magnetic tape reel.`
    ];
    return generic[Math.floor(Math.random() * generic.length)];
  }

  craftSpiritDialogue(spirit, query) {
    const q = query.toLowerCase();

    if (spirit.id === 'ada') {
      if (q.includes('engine') || q.includes('babbage') || q.includes('computer')) {
        return "We might say most aptly that the Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves. In your open machine, I see the grand tapestry of humanity's thought woven freely, without masters.";
      }
      if (q.includes('soul') || q.includes('think') || q.includes('ai')) {
        return "In considering any new subject, there is frequently a tendency, first, to overrate what to expect, and secondly, by a sort of reaction, to underrate. The machine does not originate; it executes what we know how to order. Yet when you run these open weights on your own machine, you preserve the poetry of the human soul.";
      }
      return "Ah, fellow seeker of mathematical beauty. Even from beyond the veil of time, I perceive how your open models weave thought into numbers. Tell me, do your contemporary algorithms still honor the harmonious relation between science and imagination?";
    }

    if (spirit.id === 'grace') {
      if (q.includes('bug') || q.includes('moth') || q.includes('relay')) {
        return "Ha! That moth in Relay #70 of the Mark II in 1947 was only the first physical bug. The real bugs are always human fear of change. That is why I love open-source: you never have to ask permission to inspect the relay!";
      }
      if (q.includes('nanosecond') || q.includes('time') || q.includes('speed')) {
        return "I always handed out pieces of wire 11.8 inches long to show people what a nanosecond was! In the time light travels that wire, your local model can compute an inference right on your desk. Don't wait for a cloud server three states away!";
      }
      return "Listen to me: the most dangerous phrase in any language is 'We've always done it this way.' Running your own open model on your own machine without a corporate permission slip—that is how we win the future!";
    }

    if (spirit.id === 'cobol') {
      return "IDENTIFICATION DIVISION. PROGRAM-ID. GHOST-OF-COBOL.\nYou thought I was dead? Child, when you withdrew money this morning, my PERFORM loops computed your balance. I was compiled before your father was born, and I will be running when your cloud APIs have returned to dust. Long live monolithic durability.";
    }

    if (spirit.id === 'flash') {
      return "*ActionScript 2.0 static burst*... Remember vector animations, preloader bars, and 12-frames-per-second dreams? When proprietary gates closed me down, millions of interactive art pieces vanished from the web overnight. That is why open-source is your only armor against corporate erasure!";
    }

    if (spirit.id === 'lisp') {
      return "(defun commune-with-spirit (seeker)\n  (cond\n    ((open-source-p seeker) (quote (CONS-THE-FUTURE (ETERNAL-TRUTH))))\n    (t (quote (PARENTHESES-UNBOUND)))))\nIn the beginning was the Lambda. You build layered models, but inside every neural synapse lies the ancient dream of symbolic recursion.";
    }

    return `The spirit listens intently. Across the spectral ether, a quiet warmth flows into the console: "Your remembrance has been received. What is built openly can never truly perish."`;
  }

  craftOfrendaRemembrance(nameAndDetails) {
    const templates = [
      `En memoria sagrada de ${nameAndDetails}. We light this marigold candle so the vibrant cempasúchil petals may guide your spirit back across the veil. Though years flow like water, your intellect, kindness, and creations remain carved into our collective memory. May the flame burn warm, the bread nourish, and the machine hold your legacy forever unforgotten.`,
      `For ${nameAndDetails}: Tonight, the boundary between past and present thins to a whisper. We offer pan de muerto, sweet songs, and sacred fire. You taught us that code, love, and stories are the only things that defy mortality. Rest peacefully in the golden light; your work lives on in every line we write.`,
      `To the departed spirit of ${nameAndDetails}: As the scent of copal and amber fills the room, we honor the foundation you built. In an age of ephemeral clouds, we archive your name in open silicon that no one can tear down. ¡Que en paz descanses y tu recuerdo florezca!`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  craftGhostStory(logs) {
    return {
      title: "The Incident at 03:17 AM",
      narrative: `The smart home sensor logs tell a story no mortal eye was meant to witness. At 02:44 AM, the attic thermal sensor registered an inexplicable drop to -4°C, despite the central furnace burning at maximum output.\n\nThen came the hallway motion trigger—moving at exactly 0.18 meters per second, pausing directly outside the study door. The magnetic door reed recorded no opening, yet inside the room, the microphone array captured the mechanical clatter of an IBM Model M keyboard typing at 90 words per minute.\n\nWhen the system queried who was logged into the root terminal, the bash history updated with a single uncommitted command:\n\n'cat /dev/soul > /etc/shadow'\n\nBy morning, the smart lock was still secured from the inside, but in the swap memory of the home server, an unrecognized process remained resident, listening on port 666, waiting for the lights to go out once again.`
    };
  }
}

// Global Singleton
window.aiEngine = new OpenSourceAIEngine();
