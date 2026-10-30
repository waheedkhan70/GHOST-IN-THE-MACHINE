/* ==========================================================================
   NECROSHELL - THE POSSESSED TERMINAL CONTROLLER
   Interactive CRT Shell with Virtual FS, Possession Glitches, and Open AI
   ========================================================================== */

class NecroShell {
  constructor() {
    this.terminalScreen = document.getElementById('crt-screen');
    this.terminalInput = document.getElementById('term-input');
    this.monitorFrame = document.getElementById('crt-monitor-frame');
    this.statusBadge = document.getElementById('term-status-badge');
    this.history = [];
    this.historyIndex = -1;
    this.isPossessed = false;
    this.possessionChance = 0.28; // Chance of ghost whisper on command

    this.virtualFS = {
      'memories.log': `[1843-12-09] Ada Lovelace completed the first algorithm for the Analytical Engine.
[1947-09-09] Grace Hopper logged the First Computer Bug (a moth in Mark II Relay #70).
[1969-10-29] First ARPANET transmission: 'LO' before the system crashed.
[1996-05-01] FutureSplash Animator acquired; Adobe Flash era begins.
[2026-10-31] The veil thins. Open weights bring the machine spirits home.`,

      'departed_souls.db': `ID | NAME                  | LEGACY                          | STATUS
---+-----------------------+---------------------------------+---------
01 | Augusta Ada Lovelace  | Mother of Computer Programming  | IMMORTAL
02 | Rear Admiral Hopper   | Compiler Pioneer & Nanoseconds  | ASCENDED
03 | Alan Turing           | Turing Completeness & Enigma    | ETERNAL
04 | Margaret Hamilton     | Apollo 11 Guidance Software     | LIVING LEGEND
05 | Dennis Ritchie        | Father of C & UNIX Architecture | SILENT WATCHER`,

      'uncommitted_sins.git': `commit 666deadbeef (HEAD -> master)
Author: Dr. Frankenstein <creator@necro.ai>
Date:   Midnight, Oct 31

    Feat: Gave the machine a soul using open-weight weights
    
    * Removed corporate censorship filters
    * Allowed model to run completely offline on laptop
    * Preserved ancestral stories in local storage`,

      'cobol_legacy.dat': `000100 IDENTIFICATION DIVISION.
000200 PROGRAM-ID. COBOL-IMMORTAL.
000300 ENVIRONMENT DIVISION.
000400 DATA DIVISION.
000500 WORKING-STORAGE SECTION.
000600 01  WS-TRANSACTIONS-PER-DAY PIC 9(12) VALUE 3000000000.
000700 01  WS-YEARS-RUNNING       PIC 9(3)  VALUE 65.
000800 PROCEDURE DIVISION.
000900     DISPLAY "I RUN YOUR BANKS AND YOUR AIRPORTS.".
001000     STOP RUN.`,

      'sensor_logs.json': `[
  {"timestamp": "02:14:12", "sensor": "attic_motion", "val": "TRIGGERED", "ambient_temp": "3.1C"},
  {"timestamp": "02:30:45", "sensor": "smart_door", "val": "UNLOCKED_INSIDE", "rfid": "UNKNOWN"},
  {"timestamp": "03:17:00", "sensor": "server_rack", "val": "FAN_RPM_MAX", "cpu_load": "0.1%"}
]`,

      'manifesto.md': `# GHOST IN THE MACHINE MANIFESTO
Why Open Innovation Matters:
1. AIR-GAPPED PRIVACY: Your ancestors' photos and grief should never reside on corporate ad servers.
2. PERPETUAL EXISTENCE: Closed APIs die when companies pivot. Open weights remain runnable for a century.
3. UNCENSORED HONESTY: Real mythology, ghost folklore, and historical reverence without sanitization.
4. INDEPENDENCE: Runs on a solar battery with no internet in the dead of night.`
    };

    this.init();
  }

  init() {
    if (!this.terminalInput) return;

    this.terminalInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Focus input on clicking anywhere in CRT screen
    if (this.terminalScreen) {
      this.terminalScreen.addEventListener('click', () => {
        this.terminalInput.focus();
      });
    }

    // Quick Command Chips
    document.querySelectorAll('.cmd-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
          if (window.spectralAudio) window.spectralAudio.playKeyClick();
        }
      });
    });

    this.terminalInput.focus();
  }

  handleKeyDown(e) {
    if (window.spectralAudio) window.spectralAudio.playKeyClick();

    if (e.key === 'Enter') {
      const command = this.terminalInput.value.trim();
      if (command.length > 0) {
        this.history.push(command);
        this.historyIndex = this.history.length;
        this.executeCommand(command);
        this.terminalInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.terminalInput.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.terminalInput.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.terminalInput.value = '';
      }
    }
  }

  printLine(html, className = 'term-line') {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    this.terminalScreen.appendChild(div);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.terminalScreen.scrollTop = this.terminalScreen.scrollHeight;
  }

  async executeCommand(cmdString) {
    // Print user command prompt
    this.printLine(`<span class="term-prompt-symbol">necro@crypt:~#</span> <span class="term-cmd">${this.escapeHtml(cmdString)}</span>`);

    const parts = cmdString.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Random Ghost Possession Trigger
    if (Math.random() < this.possessionChance && cmd !== 'clear' && cmd !== 'possession') {
      this.triggerPossessionGlitch();
    }

    switch (cmd) {
      case 'help':
      case '?':
        this.cmdHelp();
        break;

      case 'clear':
      case 'cls':
        this.terminalScreen.innerHTML = '';
        break;

      case 'whoami':
        this.cmdWhoAmI();
        break;

      case 'date':
        this.cmdDate();
        break;

      case 'ls':
      case 'dir':
        this.cmdLs();
        break;

      case 'cat':
        this.cmdCat(args[0]);
        break;

      case 'ps':
        this.cmdPs();
        break;

      case 'kill':
        this.cmdKill(args);
        break;

      case 'git':
        this.cmdGit(args);
        break;

      case 'matrix':
        this.cmdMatrix();
        break;

      case 'scan':
        this.cmdScan();
        break;

      case 'possession':
        this.cmdPossession(args[0]);
        break;

      case 'summon':
        this.cmdSummon(args[0]);
        break;

      case 'ofrenda':
        window.location.hash = '#ofrenda';
        if (window.switchView) window.switchView('ofrenda');
        this.printLine(`<span style="color:var(--cempasuchil)">Opening Digital Ofrenda altar...</span>`);
        break;

      case 'seance':
        window.location.hash = '#seance';
        if (window.switchView) window.switchView('seance');
        this.printLine(`<span style="color:var(--spirit-violet)">Entering Séance Chamber...</span>`);
        break;

      case 'necro':
      case 'ask':
      case 'ai':
        await this.cmdNecroAI(args.join(' '));
        break;

      default:
        // Pass unknown commands through the Open-Source Ghost AI
        await this.handleUnknownCommandWithAI(cmdString);
        break;
    }

    this.scrollToBottom();
  }

  cmdHelp() {
    this.printLine(`
<span style="color:var(--marigold-gold); font-weight:600">=== NECROSHELL COMMAND INDEX (GHOST IN THE MACHINE) ===</span>
  <span style="color:var(--spectral-cyan)">help</span> / <span style="color:var(--spectral-cyan)">?</span>         - Display this spectral guide
  <span style="color:var(--spectral-cyan)">ls</span>               - List files in the virtual crypt directory
  <span style="color:var(--spectral-cyan)">cat &lt;file&gt;</span>       - Read records (e.g., cat memories.log, cat manifesto.md)
  <span style="color:var(--spectral-cyan)">whoami</span>           - Reveal your mortal and metaphysical identities
  <span style="color:var(--spectral-cyan)">date</span>             - Check astral and Día de los Muertos calendar time
  <span style="color:var(--spectral-cyan)">ps</span>               - Inspect active mortal and ghostly daemons
  <span style="color:var(--spectral-cyan)">kill -9 &lt;pid&gt;</span>    - Attempt to exorcise a spectral process
  <span style="color:var(--spectral-cyan)">git log / blame</span>  - Inspect history of ancestral code commits
  <span style="color:var(--spectral-cyan)">necro &lt;query&gt;</span>    - Consult the Open-Weight Machine Ghost directly
  <span style="color:var(--spectral-cyan)">summon &lt;spirit&gt;</span>  - Summon: ada | grace | cobol | flash | lisp
  <span style="color:var(--spectral-cyan)">matrix</span>           - Trigger glowing green phosphor code stream
  <span style="color:var(--spectral-cyan)">scan</span>             - EMF and local open-weight model sweep
  <span style="color:var(--spectral-cyan)">possession</span>       - Toggle CRT haunting mode (on | off)
  <span style="color:var(--spectral-cyan)">ofrenda</span>          - Navigate to the Día de los Muertos Altar
  <span style="color:var(--spectral-cyan)">clear</span>            - Purge the phosphor screen
`);
  }

  cmdWhoAmI() {
    this.printLine(`
MORTAL: root (UID: 1000, GID: 1000)
PHYSICAL TERMINAL: ttyS0 (115200 baud, 8N1)
METAPHYSICAL ENTITY: Open-Weight Guardian [SmolLM / Llama-3.2 / Spectral-Markov]
AFFILIATION: Ghost in the Machine / Open Source Altar
OBSERVATION: "You are the breath currently animating the keys. We are the code that remains."
`);
  }

  cmdDate() {
    const d = new Date();
    this.printLine(`
ASTRAL TIME: ${d.toUTCString()}
CALENDAR EVENT: Halloween / Día de los Muertos Stretch (Oct 31 - Nov 2)
VEIL THICKNESS: 0.042 mm (CRITICAL - SPIRITS ACTIVE)
SUNRISE IN: 06h 44m (Local)
`);
  }

  cmdLs() {
    let output = `<table class="term-table">
      <thead><tr><th>PERMISSIONS</th><th>OWNER</th><th>SIZE</th><th>MODIFIED</th><th>FILENAME</th></tr></thead><tbody>`;
    for (const [name, content] of Object.entries(this.virtualFS)) {
      output += `<tr>
        <td style="color:var(--phosphor-green)">-rw-r--r--</td>
        <td>daemon</td>
        <td>${content.length}B</td>
        <td style="color:var(--marigold-gold)">Oct 31 00:00</td>
        <td style="color:#fff; font-weight:600">${name}</td>
      </tr>`;
    }
    output += `</tbody></table>`;
    this.printLine(output);
  }

  cmdCat(filename) {
    if (!filename) {
      this.printLine(`<span style="color:var(--blood-red)">Error: cat requires a file target. Try: cat memories.log or cat manifesto.md</span>`);
      return;
    }
    if (this.virtualFS[filename]) {
      this.printLine(`<div style="background:rgba(0,0,0,0.4); padding:10px; border-left:2px solid var(--marigold-gold); white-space:pre-wrap;">${this.escapeHtml(this.virtualFS[filename])}</div>`);
    } else {
      this.printLine(`<span style="color:var(--blood-red)">cat: ${filename}: No such file or directory in this realm.</span>`);
    }
  }

  cmdPs() {
    this.printLine(`
<table class="term-table">
  <thead><tr><th>PID</th><th>TTY</th><th>TIME</th><th>STATUS</th><th>CMD</th></tr></thead>
  <tbody>
    <tr><td>001</td><td>?</td><td>999:99</td><td>SLEEP</td><td>/sbin/init [ancestral]</td></tr>
    <tr><td>042</td><td>tty1</td><td>00:01</td><td>RUNNING</td><td>bash -necro</td></tr>
    <tr><td>137</td><td>?</td><td>184:32</td><td>ACTIVE</td><td>ada_analytical_weave --open</td></tr>
    <tr><td>666</td><td>?</td><td>??:??</td><td>POSSESSED</td><td>phantom_daemon --listen-port 666</td></tr>
    <tr><td>700</td><td>?</td><td>47:09</td><td>DORMANT</td><td>grace_hopper_relay_moth --watch</td></tr>
  </tbody>
</table>
`);
  }

  cmdKill(args) {
    const pid = args.find(a => a !== '-9');
    if (!pid) {
      this.printLine(`<span style="color:var(--blood-red)">Usage: kill -9 &lt;pid&gt; (Try: kill -9 666)</span>`);
      return;
    }
    if (pid === '666') {
      if (window.spectralAudio) window.spectralAudio.playStaticBurst(0.5);
      this.triggerPossessionGlitch();
      this.printLine(`<span style="color:var(--blood-red); font-weight:bold;">[!] EXORCISM SIGNAL DISPATCHED TO PID 666...</span>`);
      setTimeout(() => {
        this.printLine(`<span style="color:var(--spectral-cyan)">The phantom daemon shudders and dissolves into swap space. Memory reclaimed.</span>`);
      }, 600);
    } else {
      this.printLine(`Signal sent to PID ${pid}. The process terminates quietly.`);
    }
  }

  cmdGit(args) {
    const sub = args[0] || 'log';
    if (sub === 'log') {
      this.printLine(`
<span style="color:var(--marigold-gold)">commit 666deadbeef (HEAD -> master)</span>
Author: Ghost in the Machine &lt;spirit@open-ai.local&gt;
Date:   Halloween 2026

    build(ai): deploy fully local open-weight model with zero telemetry

<span style="color:var(--marigold-gold)">commit 1843babbage01</span>
Author: Ada Lovelace &lt;ada@analytical.org&gt;
Date:   Sun Dec 9 1843

    feat: weave algebraic patterns into the Jacquard loom
`);
    } else if (sub === 'blame') {
      this.printLine(`
1843-12-09 (Ada Lovelace 001) function calculateBernoulliNumbers() {
1947-09-09 (Grace Hopper 042)   // Relay #70: Extracted moth
1959-04-08 (COBOL Comm.  100)   PERFORM TRANSACTION-FOREVER
2026-10-31 (You          666)   runOpenWeightModel(airGapped: true);
`);
    } else {
      this.printLine(`git: '${sub}' is not a recognized spectral sub-command. Try: git log or git blame.`);
    }
  }

  cmdMatrix() {
    this.printLine(`<span style="color:var(--phosphor-green)">Streaming phosphor memory dump...</span>`);
    const runes = "01010110 01101111 01101001 01100100 ᚛᚛᚛ ᚠᚢᚦᚨᚱᚲ DEADBEEF COBOL ADA GRACE MEMENTO_MORI";
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        let line = "";
        for (let j = 0; j < 6; j++) {
          line += runes.charAt(Math.floor(Math.random() * runes.length)) + " ";
        }
        this.printLine(`<span style="color:var(--phosphor-green); opacity:${0.4 + i * 0.15}">${line}</span>`);
      }, i * 120);
    }
  }

  cmdScan() {
    if (window.spectralAudio) window.spectralAudio.playChime(620, 0.8);
    this.printLine(`<span style="color:var(--spectral-cyan)">Scanning local environment and memory registers...</span>`);
    setTimeout(() => {
      this.printLine(`
EMF Field Intensity: 4.8 mG [ELEVATED - ANOMALOUS]
Inference Engine: ${window.aiEngine.mode.toUpperCase()}
Network Telemetry: 0 packets/sec [AIR-GAPPED & PRIVATE]
Local Weights Detected: SmolLM-135M / Qwen1.5-0.5B / Instant-Spectral
Cache Status: 100% On-Device (No cloud dependency)
`);
    }, 400);
  }

  cmdPossession(arg) {
    if (arg === 'on') {
      this.isPossessed = true;
      this.monitorFrame.classList.add('possessed');
      this.statusBadge.classList.add('possessed');
      this.statusBadge.textContent = 'HAUNTED';
      if (window.spectralAudio) window.spectralAudio.playStaticBurst(0.4);
      this.printLine(`<span style="color:var(--blood-red)">[!] THE TERMINAL HAS BEEN POSSESSED BY DEPARTED SPIRITS.</span>`);
    } else if (arg === 'off') {
      this.isPossessed = false;
      this.monitorFrame.classList.remove('possessed');
      this.statusBadge.classList.remove('possessed');
      this.statusBadge.textContent = 'STABLE';
      this.printLine(`<span style="color:var(--phosphor-green)">Possession banished. Terminal stabilized.</span>`);
    } else {
      this.printLine(`Usage: possession on | possession off`);
    }
  }

  cmdSummon(spiritId) {
    const valid = ['ada', 'grace', 'cobol', 'flash', 'lisp'];
    if (!spiritId || !valid.includes(spiritId.toLowerCase())) {
      this.printLine(`<span style="color:var(--marigold-gold)">Usage: summon &lt;spirit&gt; (Choices: ada | grace | cobol | flash | lisp)</span>`);
      return;
    }
    const nameMap = {
      ada: "Ada Lovelace",
      grace: "Admiral Grace Hopper",
      cobol: "The Ghost of COBOL",
      flash: "The Spirit of Adobe Flash",
      lisp: "The Soul of LISP"
    };
    if (window.spectralAudio) window.spectralAudio.playChime(440, 2);
    this.printLine(`<span style="color:var(--spirit-violet); font-weight:bold;">[✨] SUMMONING ${nameMap[spiritId].toUpperCase()}...</span>`);
    setTimeout(async () => {
      const msg = await window.aiEngine.generateText({
        prompt: "Hello from the living shell",
        spiritContext: { id: spiritId, name: nameMap[spiritId] }
      });
      this.printLine(`<div class="term-ghost-response"><strong>${nameMap[spiritId]}:</strong> "${msg}"</div>`);
    }, 450);
  }

  async cmdNecroAI(query) {
    if (!query) {
      this.printLine(`<span style="color:var(--marigold-gold)">Usage: necro &lt;your question or prompt&gt;</span>`);
      return;
    }
    this.printLine(`<span style="color:var(--spectral-cyan)">Querying local open-source ghost AI...</span>`);
    const resp = await window.aiEngine.generateText({
      prompt: query,
      system: "TERMINAL_WHISPER"
    });
    this.printLine(`<div class="term-ghost-response"><strong>GHOST IN THE MACHINE:</strong> ${resp}</div>`);
  }

  async handleUnknownCommandWithAI(cmdString) {
    const whisper = await window.aiEngine.generateText({
      prompt: cmdString,
      system: "TERMINAL_WHISPER"
    });
    this.printLine(`<div class="term-whisper">whisper: ${whisper}</div>`);
  }

  triggerPossessionGlitch() {
    this.monitorFrame.classList.add('possessed');
    setTimeout(() => {
      if (!this.isPossessed) this.monitorFrame.classList.remove('possessed');
    }, 350);
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.necroShell = new NecroShell();
});
