IPM.Slider = class {
  constructor(opts) {
    opts = opts || {};
    this.barX = opts.barX || 120;
    this.barY = opts.barY || 370;
    this.barW = opts.barW || 560;
    this.barH = opts.barH || 22;
    this.speed = opts.speed || IPM.CONFIG.slider.speed;
    this.reset();
  }

  reset() {
    this.needle = 0.5;
    this.dir = 1;
    this.active = false;
    this.fired = false;
  }

  start() {
    this.reset();
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  update(dt) {
    if (!this.active) return;
    this.needle += this.dir * this.speed * dt;
    if (this.needle > 1) { this.needle = 1; this.dir = -1; }
    if (this.needle < 0) { this.needle = 0; this.dir = 1; }
  }

  getZone() {
    const n = this.needle;
    const cfg = IPM.CONFIG.slider;
    const g0 = cfg.green[0], g1 = cfg.green[1];
    const y0 = cfg.yellow[0], y1 = cfg.yellow[1], y2 = cfg.yellow[2], y3 = cfg.yellow[3];
    if (n >= g0 && n <= g1) return "perfect";
    if ((n >= y0 && n < g0) || (n > g1 && n <= y1)) return "good";
    if (n >= y2 && n <= y3) return "good";
    return "miss";
  }

  shoot() {
    if (!this.active) return null;
    this.active = false;
    this.fired = true;
    return { zone: this.getZone(), value: this.needle };
  }

  render(ctx, opts) {
    opts = opts || {};
    const P = IPM.render.PALETTE;
    const cfg = IPM.CONFIG.slider;
    const x = this.barX, y = this.barY, w = this.barW, h = this.barH;
    const g0 = cfg.green[0], g1 = cfg.green[1];
    const y0 = cfg.yellow[0], y1 = cfg.yellow[1], y2 = cfg.yellow[2], y3 = cfg.yellow[3];

    IPM.render.rect(ctx, x, y, w, h, P.redDark);
    IPM.render.rect(ctx, x + y0 * w, y, (g0 - y0) * w, h, P.yellow);
    IPM.render.rect(ctx, x + g1 * w, y, (y1 - g1) * w, h, P.yellow);
    IPM.render.rect(ctx, x + g0 * w, y, (g1 - g0) * w, h, P.green);

    // separators
    const cuts = [y0, g0, g1, y1];
    for (const c of cuts) {
      IPM.render.line(ctx, x + c * w, y, x + c * w, y + h, P.black, 2);
    }

    IPM.render.rectOutline(ctx, x, y, w, h, P.black, 2);

    // needle
    const nx = x + this.needle * w;
    const needleColor = !this.active ? P.white : P.yellow;
    IPM.render.rect(ctx, nx - 2, y - 6, 4, h + 12, needleColor);
    IPM.render.line(ctx, nx, y - 10, nx, y + h + 10, P.black, 1);
    IPM.render.rect(ctx, nx - 5, y - 12, 10, 5, needleColor);
  }
};
