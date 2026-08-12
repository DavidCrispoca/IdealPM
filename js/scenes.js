IPM.scenes = (function () {
  const R = IPM.render;
  const P = R.PALETTE;
  const W = IPM.CONFIG.width;
  const H = IPM.CONFIG.height;

  // ---------- sprites ----------
  const SPR_BASKET = [
    "..ooo..",
    ".obboo.",
    "oobbooo",
    "oobbooo",
    ".obboo.",
    "..ooo.."
  ];
  const SPR_SOCCER = [
    "..ww..",
    ".wbbw.",
    "wbwwbw",
    "wwwwww",
    ".wwww.",
    "..ww.."
  ];

  // ---------- helpers ----------
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function drawGround(ctx, y, base, alt, stripeH) {
    stripeH = stripeH || 24;
    let c = 0;
    for (let yy = y; yy < H; yy += stripeH) {
      R.rect(ctx, 0, yy, W, stripeH, c++ % 2 ? alt : base);
    }
  }

  function drawHUD(ctx, s) {
    const n = clamp(s.shot, 0, s.mg.shots - 1);
    for (let i = 0; i < s.mg.lives; i++) {
      R.text(ctx, "❤", 18 + i * 16, 24, {
        size: 12,
        color: i < s.lives ? P.red : P.gray,
        align: "left",
        shadow: i < s.lives
      });
    }
    R.text(ctx, "×" + s.mg.lives, 18 + s.mg.lives * 16 + 4, 24, { size: 9, color: P.cream, align: "left" });
    R.text(ctx, s.mg.emoji + " TIRO " + (n + 1) + " DE " + s.mg.shots, W / 2, 26, { size: 13, bold: true, align: "center", color: P.white });
    R.text(ctx, "ACIERTOS " + s.successes + "/" + s.mg.shots, W - 16, 26, { size: 10, align: "right", color: P.yellow });
    R.rect(ctx, 0, 34, W, 2, P.black);
  }

  function drawCard(ctx, s, t) {
    const ach = s.cardAch;
    const inT = clamp(t / 0.35, 0, 1);
    const rise = (1 - inT) * 12;
    const cx = W / 2, cy = 118;
    const cw = 380, ch = 150;
    const x = cx - cw / 2, y = cy - ch / 2 + rise;

    R.rect(ctx, 0, 0, W, H, "rgba(13,14,26,0.45)");
    R.panel(ctx, x, y, cw, ch, { fill: P.panel, light: P.yellow });
    R.rect(ctx, x, y, cw, 22, P.black);
    R.text(ctx, "★ ¡ACCIÓN DESBLOQUEADA!", x + cw / 2, y + 16, { size: 11, bold: true, align: "center", color: P.yellow });

    R.text(ctx, "[" + ach.type + "]", x + cw / 2, y + 42, { size: 9, align: "center", color: P.orange });
    R.text(ctx, ach.title, x + cw / 2, y + 66, { size: 16, bold: true, align: "center", color: P.white });
    const lines = R.wrap(ctx, ach.desc, cw - 36, 9);
    lines.slice(0, 3).forEach(function (ln, i) {
      R.text(ctx, ln, x + cw / 2, y + 92 + i * 14, { size: 9, align: "center", color: P.cream });
    });
    R.text(ctx, "TIRO " + (s.shot + 1) + " DE " + s.mg.shots + " · " + s.mg.emoji, x + cw / 2, y + ch - 12, { size: 9, align: "center", color: P.blue });
  }

  function drawBanner(ctx, str, sub, color) {
    R.rect(ctx, 0, 0, W, H, "rgba(13,14,26,0.35)");
    R.text(ctx, str, W / 2, 150, { size: 30, bold: true, align: "center", color: color || P.yellow });
    if (sub) R.text(ctx, sub, W / 2, 182, { size: 11, align: "center", color: P.white });
  }

  // =====================================================================
  // THEME: BASKETBALL
  // =====================================================================
  const basketballTheme = {
    drawBackground: function (ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 3; i++) R.rect(ctx, 40 + i * 220, 60 + (i % 2) * 30, 3, 3, P.white);
      for (let i = 0; i < 3; i++) R.rect(ctx, 120 + i * 180, 120 + (i % 2) * 40, 3, 3, P.cream);
      R.rect(ctx, 0, 300, W, 150, P.bgDark);
      drawGround(ctx, 330, P.brown, "#6b4423", 30);
      R.rect(ctx, 0, 330, W, 4, P.black);
      R.line(ctx, 60, 330, 60, 450, P.cream, 3);
      R.line(ctx, W - 60, 330, W - 60, 450, P.cream, 3);
      R.line(ctx, 60, 392, W - 60, 392, P.cream, 3);

      // backboard + hoop
      R.rect(ctx, 606, 130, 100, 70, P.white);
      R.rectOutline(ctx, 606, 130, 100, 70, P.black, 3);
      R.rect(ctx, 630, 145, 52, 5, P.red);
      R.rectOutline(ctx, 630, 145, 52, 5, P.black, 1);
      // rim
      R.rect(ctx, 634, 205, 48, 6, P.orange);
      R.rectOutline(ctx, 634, 205, 48, 6, P.black, 2);
      // net
      R.line(ctx, 636, 211, 644, 248, P.white, 2);
      R.line(ctx, 656, 211, 656, 250, P.white, 2);
      R.line(ctx, 678, 211, 668, 248, P.white, 2);
      R.line(ctx, 644, 248, 656, 250, P.cream, 2);
      R.line(ctx, 668, 248, 656, 250, P.cream, 2);
      // support post
      R.rect(ctx, 700, 200, 8, 130, P.gray);
      R.rect(ctx, 604, 130, 8, 8, P.gray);
    },
    drawHit: function (ctx, t, s) {
      const x = R.quad(t, 230, 430, 662);
      const y = R.quad(t, 350, 120, 208);
      R.pixelate(ctx, SPR_BASKET, x - 16, y - 16, 5);
      if (t >= 0.55) {
        R.rect(ctx, 634, 205, 48, 6, P.orange);
        R.line(ctx, 636, 211, 644, 246, P.white, 2);
        R.line(ctx, 656, 211, 656, 248, P.white, 2);
        R.line(ctx, 678, 211, 668, 246, P.white, 2);
      }
      if (t >= 0.8) {
        const alpha = Math.floor((t - 0.8) / 0.2 * 8) % 2 === 0 ? 1 : 0.3;
        R.text(ctx, s.result.zone === "perfect" ? "¡PERFECTO!" : "¡ENCESTADO!", 440, 130, { size: 22, bold: true, align: "center", color: alpha === 1 ? P.yellow : P.white });
      }
    },
    drawMiss: function (ctx, t, s) {
      let bx, by;
      if (t < 0.7) {
        const u = t / 0.7;
        bx = R.quad(u, 230, 430, 640);
        by = R.quad(u, 350, 120, 212);
      } else {
        const u = (t - 0.7) / 0.3;
        bx = lerp(640, 580, u);
        by = 212 + 60 * u;
      }
      R.pixelate(ctx, SPR_BASKET, bx - 16, by - 16, 5);
      if (t >= 0.75) {
        const alpha = Math.floor((t - 0.75) / 0.15 * 8) % 2 === 0 ? 1 : 0.3;
        R.text(ctx, "¡FUERA!", 440, 130, { size: 22, bold: true, align: "center", color: alpha === 1 ? P.red : P.white });
      }
    }
  };

  // =====================================================================
  // THEME: FOOTBALL
  // =====================================================================
  function drawKeeper(ctx, x, y, jersey, dive) {
    dive = dive || 0;
    const dx = dive;
    // legs
    R.rect(ctx, x - 9 + dx, y - 26, 8, 26, P.black);
    R.rect(ctx, x + 1 + dx, y - 26, 8, 26, P.black);
    // body
    R.rect(ctx, x - 12 + dx, y - 52, 24, 30, jersey);
    R.rectOutline(ctx, x - 12 + dx, y - 52, 24, 30, P.black, 1);
    // arms
    R.rect(ctx, x - 18 + dx, y - 50, 8, 18, jersey);
    R.rect(ctx, x + 10 + dx, y - 50, 8, 18, jersey);
    // gloves
    R.rect(ctx, x - 20 + dx, y - 34, 10, 7, P.white);
    R.rect(ctx, x + 10 + dx, y - 34, 10, 7, P.white);
    // head
    R.rect(ctx, x - 8 + dx, y - 68, 16, 16, P.skin);
    R.rectOutline(ctx, x - 8 + dx, y - 68, 16, 16, P.black, 1);
    R.rect(ctx, x - 8 + dx, y - 72, 16, 5, P.hair);
  }

  const footballTheme = {
    drawBackground: function (ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky2);
      R.rect(ctx, 0, 60, W, 60, P.bgDark);
      for (let i = 0; i < 7; i++) R.rect(ctx, 20 + i * 110, 72, 40, 4, P.purple);
      for (let i = 0; i < 7; i++) R.rect(ctx, 20 + i * 110, 80, 40, 4, P.blue);
      for (let i = 0; i < 7; i++) R.rect(ctx, 20 + i * 110, 88, 40, 4, P.blue);
      for (let i = 0; i < 7; i++) R.rect(ctx, 20 + i * 110, 96, 40, 4, P.purple);
      // pitch
      drawGround(ctx, 140, P.greenDark, P.green, 40);
      R.rect(ctx, 0, 140, W, 3, P.black);
      // goal area
      R.rect(ctx, 620, 140, 180, 310, "rgba(255,255,255,0.06)");
      R.line(ctx, 620, 160, 620, 440, P.white, 3);
      R.line(ctx, 700, 160, 700, 440, P.white, 3);
      // goal posts + net
      R.rect(ctx, 620, 150, 6, 220, P.white);
      R.rectOutline(ctx, 620, 150, 6, 220, P.black, 1);
      R.rect(ctx, 794, 150, 6, 220, P.white);
      R.rectOutline(ctx, 794, 150, 6, 220, P.black, 1);
      R.rect(ctx, 620, 146, 180, 6, P.white);
      R.rectOutline(ctx, 620, 146, 180, 6, P.black, 1);
      for (let gx = 626; gx <= 792; gx += 12) R.line(ctx, gx, 152, gx, 370, "rgba(255,255,255,0.25)", 1);
      for (let gy = 156; gy <= 366; gy += 12) R.line(ctx, 626, gy, 794, gy, "rgba(255,255,255,0.25)", 1);
      drawKeeper(ctx, 700, 340, P.blue);
    },
    drawHit: function (ctx, t, s) {
      const x = R.quad(t, 240, 480, 746);
      const y = R.quad(t, 360, 200, 172);
      R.pixelate(ctx, SPR_SOCCER, x - 16, y - 16, 6);
      // keeper dives away
      const dive = -clamp(t * 90, 0, 90);
      drawKeeper(ctx, 700 + dive, 340, P.blue);
      if (t >= 0.7) {
        const alpha = Math.floor((t - 0.7) / 0.2 * 8) % 2 === 0 ? 1 : 0.3;
        R.text(ctx, s.result.zone === "perfect" ? "¡GOL PERFECTO!" : "¡GOOOL!", 440, 120, { size: 24, bold: true, align: "center", color: alpha === 1 ? P.yellow : P.white });
      }
    },
    drawMiss: function (ctx, t, s) {
      const reach = 740;
      let bx, by;
      if (t < 0.6) {
        const u = t / 0.6;
        bx = R.quad(u, 240, 460, reach);
        by = R.quad(u, 360, 240, 280);
      } else {
        const u = (t - 0.6) / 0.4;
        bx = lerp(reach, 620, u);
        by = 280 + 70 * u;
      }
      R.pixelate(ctx, SPR_SOCCER, bx - 16, by - 16, 6);
      // keeper saves toward ball
      const dive = clamp(t * 160, 0, 60);
      drawKeeper(ctx, 700 + dive, 340, P.blue);
      if (t >= 0.75) {
        const alpha = Math.floor((t - 0.75) / 0.15 * 8) % 2 === 0 ? 1 : 0.3;
        R.text(ctx, "¡ATAJADA!", 440, 120, { size: 22, bold: true, align: "center", color: alpha === 1 ? P.red : P.white });
      }
    }
  };

  // =====================================================================
  // THEME: ARCHERY
  // =====================================================================
  function drawTarget(ctx, cx, cy, r) {
    const rings = [P.white, P.black, P.blue, P.red, P.yellow];
    for (let i = rings.length - 1; i >= 0; i--) {
      const rr = r * (1 - i / rings.length);
      R.rect(ctx, cx - rr, cy - rr, rr * 2, rr * 2, rings[i]);
      R.rectOutline(ctx, cx - rr, cy - rr, rr * 2, rr * 2, P.black, 1);
    }
  }

  function drawArrow(ctx, x, y, len) {
    R.rect(ctx, x - 1, y - len, 3, len, P.wood);
    R.rect(ctx, x - 1, y - len - 6, 3, 8, P.gray);
    R.rect(ctx, x - 3, y - 2, 7, 4, P.red);
    R.rect(ctx, x - 2, y - 5, 5, 4, P.white);
    R.rect(ctx, x - 2, y + 2, 5, 4, P.white);
  }

  const archeryTheme = {
    drawBackground: function (ctx, s) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 4; i++) R.rect(ctx, 30 + i * 190, 50 + (i % 2) * 26, 3, 3, P.white);
      R.rect(ctx, 0, 330, W, 120, P.greenDark);
      drawGround(ctx, 340, P.greenDark, "#3f9e52", 26);
      R.rect(ctx, 0, 330, W, 3, P.black);
      R.rect(ctx, 260, 118, 280, 280, P.wood);
      R.rectOutline(ctx, 260, 118, 280, 280, P.black, 4);
      drawTarget(ctx, 400, 230, 78);
      if (s && s.state === "aim") {
        const wob = Math.sin(s.time * 4) * 3;
        R.line(ctx, 400 + wob, 300, 400 + wob, 328, P.black, 2);
        R.rect(ctx, 396 + wob, 296, 9, 6, P.black);
      }
    },
    drawHit: function (ctx, t, s) {
      const y = R.quad(t, 430, 260, 236);
      drawArrow(ctx, 400, y, 40);
      if (t >= 0.8) {
        const alpha = Math.floor((t - 0.8) / 0.2 * 8) % 2 === 0 ? 1 : 0.3;
        R.text(ctx, s.result.zone === "perfect" ? "¡DIANA!" : "¡BUEN TIRO!", W / 2, 90, { size: 24, bold: true, align: "center", color: alpha === 1 ? P.yellow : P.white });
      }
    },
    drawMiss: function (ctx, t, s) {
      const offsetX = (t < 0.5 ? -1 : 1) * 0; // slight drift handled below
      const tx = 400 + Math.sin(t * 6) * 6;
      const ty = R.quad(t, 430, 260, 300);
      drawArrow(ctx, tx, ty, 40);
      if (t >= 0.75) {
        const alpha = Math.floor((t - 0.75) / 0.15 * 8) % 2 === 0 ? 1 : 0.3;
        R.text(ctx, "¡FALLÓ!", W / 2, 90, { size: 22, bold: true, align: "center", color: alpha === 1 ? P.red : P.white });
      }
    }
  };

  // =====================================================================
  // MENU
  // =====================================================================
  class Menu {
    constructor(game) {
      this.game = game;
      this.time = 0;
      this.opt = 0;
    }
    handleInput(a) {
      if (a === "fire") {
        IPM.audio.click();
        this.game.setScene(new Minigame(this.game, 0));
      }
    }
    update(dt) { this.time += dt; }
    render(ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 5; i++) R.rect(ctx, 20 + i * 160, 40 + (i % 2) * 20, 4, 4, P.white);
      R.rect(ctx, 0, 330, W, 120, P.bgDark);
      drawGround(ctx, 336, P.brown, "#6b4423", 28);

      // title
      const wob = Math.sin(this.time * 2) * 2;
      R.text(ctx, "IDEALPM", W / 2, 120 + wob, { size: 44, bold: true, align: "center", color: P.red });
      R.text(ctx, "IDEALPM", W / 2 + 4, 124 + wob, { size: 44, bold: true, align: "center", color: P.yellow });
      R.text(ctx, "IDEALPM", W / 2, 122 + wob, { size: 44, bold: true, align: "center", color: P.white });
      R.text(ctx, "EL PERFIL DEL PROJECT MANAGER IDEAL", W / 2, 150 + wob, { size: 10, align: "center", color: P.blue });

      // minigame cards
      IPM.MINIGAMES.forEach(function (mg, i) {
        const x = 70 + i * 230;
        const y = 190;
        R.panel(ctx, x, y, 210, 90, { fill: P.panel });
        R.text(ctx, mg.emoji, x + 105, y + 32, { size: 26, align: "center", color: P.white, shadow: false });
        R.text(ctx, mg.name, x + 105, y + 58, { size: 9, bold: true, align: "center", color: P.white });
        R.text(ctx, mg.intro, x + 105, y + 74, { size: 7, align: "center", color: P.orange });
      });

      const blink = Math.floor(this.time * 2.2) % 2 === 0;
      if (blink) {
        R.text(ctx, "▶ PRESIONA ESPACIO / TOCA LA PANTALLA PARA JUGAR ◀", W / 2, 420, { size: 12, bold: true, align: "center", color: P.yellow });
      }
      R.text(ctx, "3 MINIJUEGOS · 21 ACIERTOS · 10 VIDAS · 7 TIROS", W / 2, 442, { size: 8, align: "center", color: P.cream });
    }
  }

  // =====================================================================
  // MINIGAME
  // =====================================================================
  const THEMES = { basketball: basketballTheme, football: footballTheme, archery: archeryTheme };

  class Minigame {
    constructor(game, mgIndex) {
      this.game = game;
      this.mgIndex = mgIndex;
      this.mg = IPM.MINIGAMES[mgIndex];
      this.theme = THEMES[this.mg.id];
      this.slider = new IPM.Slider({ barY: 380 });
      this.resetRun();
    }

    resetRun() {
      this.shot = 0;
      this.lives = this.mg.lives;
      this.successes = 0;
      this.perfects = 0;
      this.state = "intro";
      this.timer = 0;
      this.time = 0;
      this.result = null;
      this.resultT = 0;
      this.cardAch = null;
      this.goOpt = 0;
    }

    handleInput(a) {
      if (a !== "fire") {
        if (this.state === "gameover" && (a === "up" || a === "down" || a === "left" || a === "right")) {
          this.goOpt = (this.goOpt + 1) % 2;
          IPM.audio.click();
        }
        return;
      }
      if (this.state === "aim") this.shoot();
      else if (this.state === "intro") this.timer = IPM.CONFIG.timings.intro;
      else if (this.state === "result") this.skipResult();
      else if (this.state === "clear") this.timer = IPM.CONFIG.timings.clear;
      else if (this.state === "gameover") {
        if (this.goOpt === 0) this.game.setScene(new Minigame(this.game, this.mgIndex));
        else this.game.setScene(new Menu(this.game));
      }
    }

    shoot() {
      const res = this.slider.shoot();
      if (!res) return;
      this.result = res;
      this.resultT = 0;
      this.state = "result";
      if (res.zone === "perfect") {
        IPM.audio.perfect();
      } else if (res.zone === "good") {
        IPM.audio.good();
      } else {
        IPM.audio.miss();
      }
    }

    skipResult() {
      const dur = this.result && this.result.zone === "miss" ? IPM.CONFIG.timings.fail : IPM.CONFIG.timings.result;
      this.resultT = dur;
    }

    endResult() {
      const zone = this.result.zone;
      if (zone !== "miss") {
        this.successes++;
        if (zone === "perfect") this.perfects++;
        this.game.stats.goods++;
        if (zone === "perfect") this.game.stats.perfects++;
        this.cardAch = this.mg.achievements[this.shot];
        IPM.audio.card();
        if (this.shot >= this.mg.shots - 1) {
          this.state = "clear";
          this.timer = 0;
          IPM.audio.fanfare();
        } else {
          this.shot++;
          this.state = "intro";
          this.timer = 0;
        }
      } else {
        this.game.stats.misses++;
        this.lives--;
        this.cardAch = null;
        if (this.lives <= 0) {
          this.state = "gameover";
          IPM.audio.gameOver();
        } else {
          this.state = "intro";
          this.timer = 0;
        }
      }
    }

    update(dt) {
      this.time += dt;
      if (this.state === "intro") {
        this.timer += dt;
        if (this.timer >= IPM.CONFIG.timings.intro) {
          this.state = "aim";
          this.slider.start();
        }
      } else if (this.state === "aim") {
        this.slider.update(dt);
      } else if (this.state === "result") {
        this.resultT += dt;
        const dur = this.result.zone === "miss" ? IPM.CONFIG.timings.fail : IPM.CONFIG.timings.result;
        if (this.resultT >= dur) this.endResult();
      } else if (this.state === "clear") {
        this.timer += dt;
        if (this.timer >= IPM.CONFIG.timings.clear) {
          const nextIdx = this.mgIndex + 1;
          if (nextIdx < IPM.MINIGAMES.length) this.game.setScene(new Minigame(this.game, nextIdx));
          else this.game.setScene(new Podium(this.game));
        }
      }
    }

    render(ctx) {
      this.theme.drawBackground(ctx, this);
      drawHUD(ctx, this);

      if (this.state === "intro") {
        R.text(ctx, "TIRO " + (this.shot + 1) + " DE " + this.mg.shots, W / 2, 200, { size: 16, bold: true, align: "center", color: P.white });
        const blink = Math.floor(this.time * 4) % 2 === 0;
        if (blink) R.text(ctx, "¡PREPÁRATE!", W / 2, 228, { size: 12, align: "center", color: P.yellow });
      } else if (this.state === "aim") {
        this.slider.render(ctx);
        const hint = Math.floor(this.time * 4) % 2 === 0;
        if (hint) R.text(ctx, "¡PRESIONA ESPACIO / TOCA!", W / 2, 358, { size: 10, align: "center", color: P.yellow });
      } else if (this.state === "result") {
        const t = clamp(this.resultT / (this.result.zone === "miss" ? IPM.CONFIG.timings.fail : IPM.CONFIG.timings.result), 0, 1);
        if (this.result.zone === "miss") this.theme.drawMiss(ctx, t, this);
        else this.theme.drawHit(ctx, t, this);
        if (this.result.zone !== "miss") {
          const cardIn = this.resultT - 0.35;
          if (cardIn > 0) drawCard(ctx, this, cardIn);
        } else {
          R.text(ctx, "¡FALLASTE! -1 VIDA", W / 2, 300, { size: 14, bold: true, align: "center", color: P.red });
        }
      } else if (this.state === "clear") {
        this.theme.drawBackground(ctx, this);
        drawHUD(ctx, this);
        drawBanner(ctx, "¡NIVEL SUPERADO!", "Perfil del PM más completo · Aciertos " + this.successes + "/" + this.mg.shots, P.yellow);
        const blink = Math.floor(this.time * 3) % 2 === 0;
        if (blink) R.text(ctx, "CARGANDO SIGUIENTE MINIJUEGO...", W / 2, 320, { size: 10, align: "center", color: P.blue });
      } else if (this.state === "gameover") {
        R.rect(ctx, 0, 0, W, H, "rgba(13,14,26,0.72)");
        R.panel(ctx, 200, 120, 400, 220, { fill: P.panel, light: P.red });
        R.text(ctx, "¡SE ACABARON LAS VIDAS!", W / 2, 170, { size: 18, bold: true, align: "center", color: P.red });
        R.text(ctx, "Llegaste al tiro " + (this.shot + 1) + " de " + this.mg.shots, W / 2, 196, { size: 10, align: "center", color: P.white });
        R.text(ctx, this.mg.emoji + " " + this.mg.name, W / 2, 216, { size: 9, align: "center", color: P.orange });
        const opts = ["REINTENTAR", "MENÚ"];
        opts.forEach(function (o, i) {
          const sel = this.goOpt === i;
          R.text(ctx, (sel ? "▶ " : "   ") + o, W / 2, 262 + i * 28, { size: 13, bold: sel, align: "center", color: sel ? P.yellow : P.cream });
        }.bind(this));
        R.text(ctx, "FLECHAS ↑↓ / ESPACIO", W / 2, 326, { size: 8, align: "center", color: P.gray });
      }
    }
  }

  // =====================================================================
  // PODIUM
  // =====================================================================
  class Podium {
    constructor(game) {
      this.game = game;
      this.time = 0;
    }
    handleInput(a) {
      if (a === "fire") {
        IPM.audio.fanfare();
        this.game.setScene(new Menu(this.game));
      }
    }
    update(dt) { this.time += dt; }
    render(ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 5; i++) R.rect(ctx, 20 + i * 160, 30 + (i % 2) * 20, 4, 4, P.white);
      R.text(ctx, "🏆", W / 2, 56, { size: 30, align: "center", shadow: false });
      R.text(ctx, IPM.PODIUM.title, W / 2, 88, { size: 20, bold: true, align: "center", color: P.yellow });
      R.text(ctx, IPM.PODIUM.intro, W / 2, 108, { size: 9, align: "center", color: P.white });

      const st = this.game.stats;
      R.text(ctx, "PERFECTOS " + st.perfects + " · BUENOS " + st.goods + " · FALLOS " + st.misses + " · ACIERTOS 21/21", W / 2, 128, { size: 9, align: "center", color: P.orange });

      const cols = [IPM.PODIUM.essentials, IPM.PODIUM.industry, IPM.PODIUM.context];
      cols.forEach(function (col, i) {
        const x = 16 + i * 258;
        const y = 148;
        R.panel(ctx, x, y, 250, 270, { fill: i === 0 ? "#3a2b4d" : P.panel });
        R.text(ctx, col.title, x + 125, y + 22, { size: 10, bold: true, align: "center", color: P.yellow });
        R.line(ctx, x + 12, y + 30, x + 238, y + 30, P.black, 2);
        col.items.forEach(function (it, j) {
          const lines = R.wrap(ctx, it, 226, 8);
          let yy = y + 50 + j * 6;
          lines.slice(0, 4).forEach(function (ln) {
            R.text(ctx, ln, x + 12, yy, { size: 8, align: "left", color: P.cream });
            yy += 13;
          });
        });
      });

      const blink = Math.floor(this.time * 2.2) % 2 === 0;
      if (blink) R.text(ctx, "▶ ESPACIO / TOCA PARA VOLVER AL INICIO ◀", W / 2, 436, { size: 11, bold: true, align: "center", color: P.green });
    }
  }

  return { Menu: Menu, Minigame: Minigame, Podium: Podium };
})();
