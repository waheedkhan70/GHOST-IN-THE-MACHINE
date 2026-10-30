/* ==========================================================================
   GHOST STORY WEAVER & SENSOR ANOMALY DETECTOR
   Transforms IoT telemetry and smart device anomalies into chilling lore
   ========================================================================== */

class GhostStoryWeaver {
  constructor() {
    this.sensorLogsBox = document.getElementById('sensor-logs-input');
    this.storyOutputBox = document.getElementById('story-output-content');
    this.generateBtn = document.getElementById('btn-generate-story');
    this.presetSelect = document.getElementById('story-preset-select');

    this.presets = {
      smarthome: `[02:14:12 AM] Attic PIR Motion Sensor: ACTIVE (Velocity: 0.18 m/s, Vector: Downward towards staircase)
[02:28:40 AM] Smart Thermostat (Hallway): Ambient temp dropped from 21.0°C to -3.8°C in 12 seconds
[02:44:03 AM] Smart Lock (Front Door): UNLOCKED from INSIDE. (No latch sound detected)
[03:12:19 AM] Smart Speaker (Living Room): Microphone triggered by phantom phoneme array: "D-E-A-D-B-E-E-F"
[03:17:00 AM] Smart Refrigerator: Internal door opened. Chime silenced by software override`,

      gitrepo: `[23:59:58] git checkout -b feature/the-awakening
[00:00:01] 1 file changed, 666 insertions(+), 0 deletions(-)
[00:04:12] Author: Anonymous Daemon <null@0x0.void>
[00:15:30] Commit message: "They decommissioned the build server, but left the power supply plugged in."
[00:32:00] Warning: Remote origin unreachable. Yet code was pushed to all staging branches.`,

      serverrack: `[01:05:00] Server Rack #4: Power draw surged from 450W to 3,200W
[01:12:33] Tape Drive 0: Mechanical autoload cycle triggered. Vintage 9-track magnetic reel spinning
[01:34:00] Temperature Sensor B3: Heat spike: 104°C. Air conditioning units reporting frost buildup
[01:58:22] Network Interface eth0: Inbound transmission received on IP 0.0.0.0 via Arpanet protocol 1969`,

      mirror: `[03:33:33] Smart Mirror (Bathroom): Camera detected 2 faces in front of reflection. Occupancy count: 1
[03:34:00] Display backlight dimmed to 3%. Text overlay generated: "DO NOT BLINK"
[03:35:12] Capacitive touch glass registered 5 finger drags across the screen from underneath the glass`
    };

    this.init();
  }

  init() {
    if (this.presetSelect && this.sensorLogsBox) {
      this.presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (this.presets[val]) {
          this.sensorLogsBox.value = this.presets[val];
          if (window.spectralAudio) window.spectralAudio.playKeyClick();
        }
      });
      // Initial preset
      this.sensorLogsBox.value = this.presets.smarthome;
    }

    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.generateStory());
    }
  }

  async generateStory() {
    const logs = this.sensorLogsBox.value.trim();
    if (!logs) return;

    if (window.spectralAudio) {
      window.spectralAudio.playStaticBurst(0.4);
      window.spectralAudio.playChime(380, 2);
    }

    this.storyOutputBox.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--spectral-cyan);">
        <div style="font-size:2rem; margin-bottom:12px;">🕯️ ⚡ 📖</div>
        <div>Weaving dark narrative through open-source AI weights...</div>
      </div>
    `;

    const storyResult = await window.aiEngine.generateText({
      prompt: logs,
      system: 'GHOST_STORY'
    });

    const title = typeof storyResult === 'object' ? storyResult.title : "The Incident at 03:17 AM";
    const body = typeof storyResult === 'object' ? storyResult.narrative : storyResult;

    this.storyOutputBox.innerHTML = `
      <h3>${this.escapeHtml(title)}</h3>
      <div style="white-space:pre-wrap; line-height:1.75; font-size:0.95rem; color:#e2e8f0;">
        ${this.escapeHtml(body)}
      </div>
      <div style="margin-top:24px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-mono); font-size:0.74rem; color:var(--spectral-cyan);">GENERATED OFFLINE • ZERO SERVERS CONTACTED</span>
        <button class="btn-spectral" id="btn-copy-story">📋 Copy Tale</button>
      </div>
    `;

    document.getElementById('btn-copy-story').addEventListener('click', () => {
      navigator.clipboard.writeText(`${title}\n\n${body}`);
      if (window.showToast) window.showToast('Ghost story copied to clipboard!', 'cyan');
    });
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
  window.ghostStoryWeaver = new GhostStoryWeaver();
});
