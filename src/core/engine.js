export const DEFAULT_DELAY = 1200;

export class PlaybackEngine {
  constructor(onChange) { this.onChange = onChange; this.steps = []; this.cursor = 0; this.timer = null; this.delay = DEFAULT_DELAY; }
  load(steps) { this.stop(); this.steps = steps; this.cursor = 0; this.notify(); }
  get current() { return this.steps[this.cursor]; }
  get progress() { return this.steps.length > 1 ? this.cursor / (this.steps.length - 1) : 0; }
  move(delta) { this.stop(); this.cursor = Math.max(0, Math.min(this.steps.length - 1, this.cursor + delta)); this.notify(); }
  reset() { this.stop(); this.cursor = 0; this.notify(); }
  setDelay(delay) { const playing = Boolean(this.timer); this.stop(); this.delay = delay; if (playing) this.play(); }
  play() {
    if (this.timer) return this.stop();
    if (this.cursor >= this.steps.length - 1) this.cursor = 0;
    this.timer = setInterval(() => {
      if (this.cursor >= this.steps.length - 1) return this.stop();
      this.cursor += 1; this.notify();
      if (this.cursor >= this.steps.length - 1) this.stop();
    }, this.delay);
    this.notify();
  }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; this.notify(); }
  notify() { if (this.onChange) this.onChange(this); }
}
