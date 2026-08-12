IPM.scenes = (function () {
  const R = IPM.render;
  const P = R.PALETTE;
  const W = IPM.CONFIG.width;
  const H = IPM.CONFIG.height;
  const PI = Math.PI;

  // ---------- sprites ----------
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

  // ---------- HUD ----------
  function drawHUD(ctx, s) {
    const n = clamp(s.shot, 0, s.mg.shots - 1);
    for (let i = 0; i < s.mg.lives; i++) {
      R.text(ctx, "❤", 18 + i * 19, 26, {
        size: 12,
        color: i < s.lives ? P.red : P.gray,
        align: "left",
        shadow: i < s.lives
      });
    }
    R.text(ctx, "×" + s.mg.lives, 18 + s.mg.lives * 19 + 4, 26, { size: 10, color: P.cream, align: "left" });
    R.text(ctx, s.mg.emoji + " TIRO " + (n + 1) + " DE " + s.mg.shots, W / 2, 28, { size: 14, bold: true, align: "center", color: P.white });
    R.text(ctx, "ACIERTOS " + s.successes + "/" + s.mg.shots, W - 16, 28, { size: 11, align: "right", color: P.yellow });
    R.rect(ctx, 0, 40, W, 3, P.black);
  }

  // ---------- tarjeta de acierto ----------
  function drawCard(ctx, s, t, typed) {
    const ach = s.cardAch;
    if (!ach) return;
    const inT = clamp(t / 0.35, 0, 1);
    const rise = (1 - inT) * 16;
    const cx = W / 2, cy = 120;
    const cw = 440, ch = 180;
    const x = cx - cw / 2, y = cy - ch / 2 + rise;

    R.rect(ctx, 0, 0, W, H, "rgba(13,14,26,0.5)");
    R.panel(ctx, x, y, cw, ch, { fill: P.panel, light: P.yellow });
    R.rect(ctx, x, y, cw, 26, P.black);
    R.text(ctx, "★ ¡ACCIÓN DESBLOQUEADA!", x + cw / 2, y + 18, { size: 12, bold: true, align: "center", color: P.yellow });

    R.text(ctx, "[" + ach.type + "]", x + cw / 2, y + 52, { size: 9, align: "center", color: P.orange });
    R.text(ctx, ach.title, x + cw / 2, y + 80, { size: 17, bold: true, align: "center", color: P.white });

    R.circle(ctx, x + 46, y + 118, 20, "#1c1e33");
    R.circleOutline(ctx, x + 46, y + 118, 20, P.yellow, 2);
    R.text(ctx, s.mg.emoji, x + 46, y + 124, { size: 16, align: "center", color: P.white, shadow: false });

    const textX = x + 78, textY = y + 100, maxW = cw - 92;
    const lines = R.wrap(ctx, ach.desc, maxW, 9);
    const full = lines.join("\n");
    const typedFrac = typed == null ? 1 : clamp(typed, 0, 1);
    const chars = Math.floor(full.length * typedFrac);
    let budget = chars;
    let done = true;
    let drawn = "";
    let lastY = textY;
    for (let i = 0; i < lines.length && budget > 0; i++) {
      let ln = lines[i];
      if (budget < ln.length) { ln = ln.slice(0, budget); done = false; }
      budget -= ln.length + 1;
      R.text(ctx, ln, textX, textY + i * 16, { size: 9, align: "left", color: P.cream });
      drawn = ln;
      lastY = textY + i * 16;
    }
    if (!done && Math.floor(s.time * 6) % 2 === 0) {
      const wd = ctx.measureText(drawn).width;
      R.rect(ctx, textX + wd + 3, lastY - 8, 5, 10, P.yellow);
    }
    R.text(ctx, "TIRO " + (s.shot + 1) + " DE " + s.mg.shots + " · " + s.mg.emoji, x + cw / 2, y + ch - 14, { size: 9, align: "center", color: P.blue });
  }
function drawBanner(ctx, str, sub, color) {
    R.rect(ctx, 0, 0, W, H, "rgba(13,14,26,0.4)");
    R.text(ctx, str, W / 2, 150, { size: 32, bold: true, align: "center", color: color || P.yellow });
    if (sub) R.text(ctx, sub, W / 2, 188, { size: 12, align: "center", color: P.white });
  }

  // ---------- sprites: dibuja sprite si está listo, si no usa el fallback ----------
  function spriteOr(ctx, key, cx, cy, scale, fb) {
    if (IPM.sprites && IPM.sprites.ready(key)) {
      IPM.sprites.drawCentered(ctx, key, cx, cy, scale || 1);
      return true;
    }
    if (fb) fb(ctx);
    return false;
  }

  function drawFloorShadow(ctx, cx, cy, rx) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, Math.max(3, rx * 0.22), 0, 0, PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // =====================================================================
  // THEME: BASKETBALL  (cancha lateral, estilo retro de costado)
  // =====================================================================
  const PLAYER_X = 150;
  const PLAYER_FEET = 440;
  const PLAYER_SCALE = 2.6;
  const HOOP_X = 640;
  const RIM_Y = 210;
  const HOOP_SCALE = 2.6;
  const BALL_SCALE = 1.4;
  const BALL_HAND_X = 196;
  const BALL_HAND_Y = 356;

  function drawBall(ctx, cx, cy, scale) {
    spriteOr(ctx, "basketballBall", cx, cy, scale || BALL_SCALE, function () {
      R.circle(ctx, cx, cy, 12 * (scale || BALL_SCALE), P.orange);
      R.circleOutline(ctx, cx, cy, 12 * (scale || BALL_SCALE), "#6b3408", 2);
    });
  }

  function drawNet(ctx, color) {
    R.line(ctx, 622, 210, 630, 246, color, 2);
    R.line(ctx, 634, 210, 640, 248, color, 2);
    R.line(ctx, 656, 210, 652, 248, color, 2);
    R.line(ctx, 670, 210, 662, 246, color, 2);
    R.line(ctx, 630, 246, 640, 248, color, 1);
    R.line(ctx, 652, 248, 662, 246, color, 1);
    R.line(ctx, 636, 226, 654, 226, color, 1);
  }

  const basketballTheme = {
    drawBackground: function (ctx, s) {
      // cielo
      const sky = ctx.createLinearGradient(0, 0, 0, 315);
      sky.addColorStop(0, "#2c2f55");
      sky.addColorStop(1, "#3a4180");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, 315);
      for (let i = 0; i < 6; i++) R.rect(ctx, 20 + i * 140, 34 + (i % 3) * 18, 4, 4, "#e8ecff");

      // grada con público
      const crowdColors = ["#7a4a2c", "#e6d8b8", "#c99700", "#5aa9ff", "#e0434d", "#b06ae0", "#63d66b"];
      for (let ry = 48; ry <= 212; ry += 20) {
        for (let cx = 8; cx < W; cx += 12) {
          const off = ((cx + ry) % 16) < 8 ? 0 : 8;
          R.rect(ctx, cx, ry + off, 6, 6, crowdColors[((cx + ry * 2) >> 2) % crowdColors.length]);
        }
      }
      R.rect(ctx, 0, 220, W, 110, P.bgDark);
      R.rect(ctx, 0, 226, W, 16, P.panel);
      R.text(ctx, "IDEALPM · PM * IDEAL * PM", W / 2, 240, { size: 9, align: "center", color: P.orange, shadow: false });

      // cancha lateral: parquet plano (vista de costado)
      for (let yy = 330; yy < H; yy += 24) {
        R.rect(ctx, 0, yy, W, 24, yy % 48 ? "#b97f38" : "#c8904a");
      }
      for (let bx = 40; bx < W; bx += 60) {
        R.line(ctx, bx, 332, bx, 448, "rgba(0,0,0,0.10)", 2);
      }
      // marcas pintadas: línea de fondo, círculos central y de tiro libre
      R.line(ctx, 740, 330, 740, 450, P.white, 3);
      R.ellipse(ctx, 390, 400, 80, 15, P.white, 3);
      R.ellipse(ctx, 560, 404, 90, 17, P.white, 3);

      // tablero + aro + red (sprite grande) con sombra en el suelo
      drawFloorShadow(ctx, HOOP_X, 400, 42);
      spriteOr(ctx, "basketballHoop", HOOP_X, RIM_Y - 5.5 * HOOP_SCALE, HOOP_SCALE, function () {
        R.rect(ctx, 600, 142, 84, 64, P.white);
        R.rectOutline(ctx, 600, 142, 84, 64, P.black, 3);
        R.rectOutline(ctx, 620, 158, 40, 30, P.orange, 3);
        R.rect(ctx, 616, 210, 52, 6, P.orange);
        R.rectOutline(ctx, 616, 210, 52, 6, P.black, 2);
        drawNet(ctx, P.white);
      });
      // poste y base hasta el suelo (el sprite solo incluye la parte alta)
      R.rect(ctx, 688, 214, 10, 178, P.gray);
      R.rectOutline(ctx, 688, 214, 10, 178, P.black, 1);
      R.rect(ctx, 682, 390, 22, 8, P.gray);
      R.rectOutline(ctx, 682, 390, 22, 8, P.black, 1);

      // jugador grande lanzando con sombra
      drawFloorShadow(ctx, PLAYER_X, PLAYER_FEET, 30);
      spriteOr(ctx, "basketballPlayer", PLAYER_X, PLAYER_FEET - 24 * PLAYER_SCALE, PLAYER_SCALE, function () {
        const x = PLAYER_X, y = PLAYER_FEET;
        R.rect(ctx, x - 18, y - 16, 15, 16, P.white);
        R.rect(ctx, x + 4, y - 16, 15, 16, P.white);
        R.rect(ctx, x - 14, y - 52, 12, 38, P.skin);
        R.rect(ctx, x + 4, y - 52, 12, 38, P.skin);
        R.rect(ctx, x - 20, y - 92, 40, 42, P.yellow);
        R.rectOutline(ctx, x - 20, y - 92, 40, 42, P.black, 2);
        R.rect(ctx, x - 24, y - 88, 12, 22, P.skin);
        R.rect(ctx, x + 14, y - 88, 12, 22, P.skin);
        R.rect(ctx, x - 11, y - 120, 22, 28, P.skin);
        R.rectOutline(ctx, x - 11, y - 120, 22, 28, P.black, 1);
        R.rect(ctx, x - 11, y - 126, 22, 9, P.hair);
      });

      // balón en manos durante la preparación / puntería
      if (!s || s.state === "intro" || s.state === "aim") {
        drawBall(ctx, BALL_HAND_X, BALL_HAND_Y, 1.3);
        drawFloorShadow(ctx, BALL_HAND_X, PLAYER_FEET, 12);
      }
    },
    drawHit: function (ctx, t, s) {
      const startX = BALL_HAND_X, startY = BALL_HAND_Y;
      const tgtX = HOOP_X, tgtY = RIM_Y;
      let bx, by;
      if (t < 0.72) {
        const u = t / 0.72;
        bx = R.quad(u, startX, 470, tgtX);
        by = R.quad(u, startY, 110, tgtY);
      } else {
        bx = tgtX;
        by = tgtY - Math.sin((t - 0.72) / 0.28 * PI) * 6;
        drawNet(ctx, P.cream);
      }
      drawFloorShadow(ctx, lerp(startX, tgtX, clamp(t, 0, 1)), PLAYER_FEET, lerp(18, 5, clamp(t, 0, 1)));
      drawBall(ctx, bx, by, BALL_SCALE);
      if (t >= 0.72) {
        for (let i = 0; i < 6; i++) {
          const a = t * 6 + i * 0.5;
          R.rect(ctx, tgtX + Math.cos(a) * 18 * (1 - (t - 0.72) / 0.28), tgtY - 24 + Math.sin(a) * 10, 4, 4, i % 2 ? P.yellow : P.white);
        }
      }
      if (t >= 0.78) {
        const alpha = Math.floor((t - 0.78) / 0.22 * 8) % 2 === 0 ? 1 : 0.35;
        R.text(ctx, s.result.zone === "perfect" ? "¡PERFECTO!" : "¡ENCESTADO!", 440, 130, { size: 24, bold: true, align: "center", color: alpha === 1 ? P.yellow : P.white });
      }
    },
    drawMiss: function (ctx, t, s) {
      let bx, by;
      if (t < 0.6) {
        const u = t / 0.6;
        bx = R.quad(u, BALL_HAND_X, 460, 600);
        by = R.quad(u, BALL_HAND_Y, 150, 140);
      } else {
        const u = (t - 0.6) / 0.4;
        bx = lerp(600, 545, u);
        by = R.quad(u, 140, 120, 360);
      }
      drawFloorShadow(ctx, lerp(BALL_HAND_X, 545, clamp(t, 0, 1)), PLAYER_FEET, lerp(18, 10, clamp(t, 0, 1)));
      drawBall(ctx, bx, by, BALL_SCALE);
      if (t >= 0.7) {
        const alpha = Math.floor((t - 0.7) / 0.15 * 8) % 2 === 0 ? 1 : 0.35;
        R.text(ctx, "¡FUERA!", 440, 130, { size: 24, bold: true, align: "center", color: alpha === 1 ? P.red : P.white });
      }
    }
  };

  // =====================================================================
  // THEME: FOOTBALL
  // =====================================================================
  function drawKeeper(ctx, x, y, jersey, dive) {
    dive = dive || 0;
    const dx = dive;
    drawFloorShadow(ctx, x + dx, y, 22);
    spriteOr(ctx, "soccerKeeper", x + dx, y - 32, 1.6, function () {
      R.rect(ctx, x - 9 + dx, y - 26, 8, 26, P.black);
      R.rect(ctx, x + 1 + dx, y - 26, 8, 26, P.black);
      R.rect(ctx, x - 12 + dx, y - 52, 24, 30, jersey);
      R.rectOutline(ctx, x - 12 + dx, y - 52, 24, 30, P.black, 1);
      R.rect(ctx, x - 18 + dx, y - 50, 8, 18, jersey);
      R.rect(ctx, x + 10 + dx, y - 50, 8, 18, jersey);
      R.rect(ctx, x - 20 + dx, y - 34, 10, 7, P.white);
      R.rect(ctx, x + 10 + dx, y - 34, 10, 7, P.white);
      R.rect(ctx, x - 8 + dx, y - 68, 16, 16, P.skin);
      R.rectOutline(ctx, x - 8 + dx, y - 68, 16, 16, P.black, 1);
      R.rect(ctx, x - 8 + dx, y - 72, 16, 5, P.hair);
    });
  }

  function drawSoccerBall(ctx, bx, by) {
    spriteOr(ctx, "soccerBall", bx, by, 1.8, function () {
      R.pixelate(ctx, SPR_SOCCER, bx - 16, by - 16, 6);
    });
  }

  const footballTheme = {
    drawBackground: function (ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky2);
      R.rect(ctx, 0, 60, W, 60, P.bgDark);
      for (let i = 0; i < 7; i++) {
        R.rect(ctx, 20 + i * 110, 72, 40, 4, P.purple);
        R.rect(ctx, 20 + i * 110, 80, 40, 4, P.blue);
        R.rect(ctx, 20 + i * 110, 88, 40, 4, P.blue);
        R.rect(ctx, 20 + i * 110, 96, 40, 4, P.purple);
      }
      drawGround(ctx, 140, P.greenDark, P.green, 40);
      R.rect(ctx, 0, 140, W, 3, P.black);
      R.rect(ctx, 620, 140, 180, 310, "rgba(255,255,255,0.06)");
      R.line(ctx, 620, 160, 620, 440, P.white, 3);
      R.line(ctx, 700, 160, 700, 440, P.white, 3);
      R.rect(ctx, 620, 150, 6, 220, P.white);
      R.rectOutline(ctx, 620, 150, 6, 220, P.black, 1);
      R.rect(ctx, 794, 150, 6, 220, P.white);
      R.rectOutline(ctx, 794, 150, 6, 220, P.black, 1);
      R.rect(ctx, 620, 146, 180, 6, P.white);
      R.rectOutline(ctx, 620, 146, 180, 6, P.black, 1);
      for (let gx = 626; gx <= 792; gx += 12) R.line(ctx, gx, 152, gx, 370, "rgba(255,255,255,0.25)", 1);
      for (let gy = 156; gy <= 366; gy += 12) R.line(ctx, 626, gy, 794, gy, "rgba(255,255,255,0.25)", 1);
      drawKeeper(ctx, 700, 340, P.blue, 0);
    },
    drawHit: function (ctx, t, s) {
      const x = R.quad(t, 240, 480, 746);
      const y = R.quad(t, 360, 200, 172);
      drawFloorShadow(ctx, lerp(240, 746, clamp(t, 0, 1)), 370, lerp(16, 6, clamp(t, 0, 1)));
      drawSoccerBall(ctx, x, y);
      const dive = -clamp(t * 90, 0, 90);
      drawKeeper(ctx, 700, 340, P.blue, dive);
      if (t >= 0.7) {
        const alpha = Math.floor((t - 0.7) / 0.2 * 8) % 2 === 0 ? 1 : 0.35;
        R.text(ctx, s.result.zone === "perfect" ? "¡GOL PERFECTO!" : "¡GOOOL!", 440, 118, { size: 26, bold: true, align: "center", color: alpha === 1 ? P.yellow : P.white });
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
      drawFloorShadow(ctx, lerp(240, 620, clamp(t, 0, 1)), 370, lerp(16, 10, clamp(t, 0, 1)));
      drawSoccerBall(ctx, bx, by);
      const dive = clamp(t * 160, 0, 60);
      drawKeeper(ctx, 700, 340, P.blue, dive);
      if (t >= 0.75) {
        const alpha = Math.floor((t - 0.75) / 0.15 * 8) % 2 === 0 ? 1 : 0.35;
        R.text(ctx, "¡ATAJADA!", 440, 118, { size: 24, bold: true, align: "center", color: alpha === 1 ? P.red : P.white });
      }
    }
  };

  // =====================================================================
  // THEME: ARCHERY
  // =====================================================================
  function drawTarget(ctx, cx, cy, r) {
    spriteOr(ctx, "targetBoard", cx, cy, 2.7, function () {
      const rings = [P.white, P.black, P.blue, P.red, P.yellow];
      for (let i = rings.length - 1; i >= 0; i--) {
        const rr = r * (1 - i / rings.length);
        R.rect(ctx, cx - rr, cy - rr, rr * 2, rr * 2, rings[i]);
        R.rectOutline(ctx, cx - rr, cy - rr, rr * 2, rr * 2, P.black, 1);
      }
    });
  }

  function drawArrow(ctx, x, y, len) {
    spriteOr(ctx, "archeryArrow", x, y - len + 22, 1, function () {
      R.rect(ctx, x - 1, y - len, 3, len, P.wood);
      R.rect(ctx, x - 1, y - len - 6, 3, 8, P.gray);
      R.rect(ctx, x - 3, y - 2, 7, 4, P.red);
      R.rect(ctx, x - 2, y - 5, 5, 4, P.white);
      R.rect(ctx, x - 2, y + 2, 5, 4, P.white);
    });
  }

  const archeryTheme = {
    drawBackground: function (ctx, s) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 4; i++) R.rect(ctx, 30 + i * 190, 50 + (i % 2) * 26, 4, 4, P.white);
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
        const alpha = Math.floor((t - 0.8) / 0.2 * 8) % 2 === 0 ? 1 : 0.35;
        R.text(ctx, s.result.zone === "perfect" ? "¡DIANA!" : "¡BUEN TIRO!", W / 2, 88, { size: 26, bold: true, align: "center", color: alpha === 1 ? P.yellow : P.white });
      }
    },
    drawMiss: function (ctx, t, s) {
      const tx = 400 + Math.sin(t * 6) * 6;
      const ty = R.quad(t, 430, 260, 300);
      drawArrow(ctx, tx, ty, 40);
      if (t >= 0.75) {
        const alpha = Math.floor((t - 0.75) / 0.15 * 8) % 2 === 0 ? 1 : 0.35;
        R.text(ctx, "¡FALLÓ!", W / 2, 88, { size: 24, bold: true, align: "center", color: alpha === 1 ? P.red : P.white });
      }
    }
  };

  // =====================================================================
  // MENU
  // =====================================================================
  const CARD_X = [70, 300, 530];
  const CARD_Y = 190;
  const CARD_W = 210;
  const CARD_H = 104;

  class Menu {
    constructor(game) {
      this.game = game;
      this.time = 0;
      this.opt = 0;
      this.lockMsg = false;
      this.lockT = 0;
    }
    unlocked() {
      return [0, 1, 2].filter((i) => this.game.isUnlocked(i));
    }
    start(idx) {
      this.game.setScene(new IPM.scenes.Minigame(this.game, idx));
    }
    cardAt(evt) {
      if (!evt) return null;
      for (let i = 0; i < 3; i++) {
        if (evt.x >= CARD_X[i] && evt.x <= CARD_X[i] + CARD_W && evt.y >= CARD_Y && evt.y <= CARD_Y + CARD_H) return i;
      }
      return null;
    }
    handleInput(a, evt) {
      if (a === "tap") a = this.cardAt(evt);
      if (a === "reset") {
        this.game.resetProgress();
        IPM.audio.click();
        this.opt = 0;
        this.lockMsg = false;
        return;
      }
      if (a === "left" || a === "right") {
        const u = this.unlocked();
        if (u.length > 1) this.opt = (this.opt + (a === "right" ? 1 : -1) + u.length) % u.length;
        IPM.audio.click();
      } else if (a === "fire") {
        const u = this.unlocked();
        if (u.length) this.start(u[this.opt % u.length]);
      } else if (typeof a === "number") {
        if (a >= 0) {
          if (this.game.isUnlocked(a)) this.start(a);
          else {
            this.lockMsg = true;
            this.lockT = 0;
            IPM.audio.miss();
          }
        }
      }
    }
    update(dt) {
      this.time += dt;
      if (this.lockMsg) this.lockT += dt;
      const u = this.unlocked();
      if (this.opt >= u.length) this.opt = Math.max(0, u.length - 1);
    }
    render(ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 5; i++) R.rect(ctx, 20 + i * 160, 40 + (i % 2) * 20, 4, 4, P.white);
      R.rect(ctx, 0, 330, W, 120, P.bgDark);
      drawGround(ctx, 336, P.brown, "#6b4423", 28);

      const wob = Math.sin(this.time * 2) * 2;
      R.text(ctx, "IDEALPM", W / 2, 118 + wob, { size: 46, bold: true, align: "center", color: P.red });
      R.text(ctx, "IDEALPM", W / 2 + 4, 122 + wob, { size: 46, bold: true, align: "center", color: P.yellow });
      R.text(ctx, "IDEALPM", W / 2, 120 + wob, { size: 46, bold: true, align: "center", color: P.white });
      R.text(ctx, "EL PERFIL DEL PROJECT MANAGER IDEAL", W / 2, 154, { size: 11, align: "center", color: P.blue });
      R.text(ctx, "CONSIGUE LOS 7 ACIERTOS DE CADA MINIJUEGO PARA DESBLOQUEAR EL SIGUIENTE", W / 2, 170, { size: 8, align: "center", color: P.cream });

      const sel = this.unlocked();
      const selIdx = sel.length ? sel[this.opt % sel.length] : 0;
      IPM.MINIGAMES.forEach((mg, i) => {
        const locked = !this.game.isUnlocked(i);
        const completed = !!this.game.progress.completed[mg.id];
        const selected = i === selIdx && !locked;
        const x = CARD_X[i], y = CARD_Y;
        if (locked) {
          ctx.globalAlpha = 0.5;
          R.panel(ctx, x, y, CARD_W, CARD_H, { fill: "#4a4c66", light: "#5a5c72" });
          R.text(ctx, mg.emoji, x + CARD_W / 2, y + 44, { size: 26, align: "center", color: P.gray, shadow: false });
          R.text(ctx, mg.name, x + CARD_W / 2, y + 76, { size: 10, bold: true, align: "center", color: P.gray, shadow: false });
          R.text(ctx, mg.intro, x + CARD_W / 2, y + 92, { size: 8, align: "center", color: P.gray, shadow: false });
          ctx.globalAlpha = 1;
          R.text(ctx, "🔒", x + CARD_W - 18, y + 22, { size: 15, align: "right", color: P.gray, shadow: false });
          R.text(ctx, "BLOQUEADO", x + CARD_W / 2, y + 60, { size: 10, bold: true, align: "center", color: P.gray, shadow: false });
        } else {
          R.panel(ctx, x, y, CARD_W, CARD_H, { fill: P.panel });
          if (selected) R.rectOutline(ctx, x - 3, y - 3, CARD_W + 6, CARD_H + 6, P.yellow, 3);
          R.text(ctx, mg.emoji, x + CARD_W / 2, y + 44, { size: 26, align: "center", color: P.white, shadow: false });
          R.text(ctx, mg.name, x + CARD_W / 2, y + 74, { size: 10, bold: true, align: "center", color: P.white });
          R.text(ctx, mg.intro, x + CARD_W / 2, y + 92, { size: 8, align: "center", color: P.orange });
          if (completed) R.text(ctx, "✓", x + CARD_W - 14, y + 22, { size: 14, align: "right", color: P.green, shadow: false });
        }
      });

      if (this.lockMsg && Math.floor(this.lockT * 3) % 2 === 0) {
        R.text(ctx, "🔒 COMPLETA EL MINIJUEGO ANTERIOR PARA DESBLOQUEARLO", W / 2, 314, { size: 12, bold: true, align: "center", color: P.red });
      }

      const blink = Math.floor(this.time * 2.2) % 2 === 0;
      if (blink) {
        R.text(ctx, "▶ PRESIONA ESPACIO / TOCA UNA CARD PARA JUGAR ◀", W / 2, 424, { size: 13, bold: true, align: "center", color: P.yellow });
      }
      R.text(ctx, "← → SELECCIONAR · ESPACIO JUGAR · R REINICIAR PROGRESO", W / 2, 446, { size: 8, align: "center", color: P.cream });
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
      this.cardT = 0;
      this.cardQueue = [];
      this.cardIdx = 0;
      this.cardDur = 1.8;
      this.goOpt = 0;
    }

    handleInput(a, evt) {
      if (a === "tap") a = "fire";
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
      else if (this.state === "card") {
        if (this.cardT < this.cardDur) this.cardT = this.cardDur;
        else this.advanceCard();
      }
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
      this.cardAch = res.zone !== "miss" ? this.mg.achievements[this.shot] : null;
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

    buildCardQueue() {
      const parsed = IPM.aciertos && IPM.aciertos.data ? IPM.aciertos.data[this.mg.id] : null;
      const entry = parsed && parsed[this.shot];
      this.cardQueue = [];
      if (entry && entry.dialogs && entry.dialogs.length) {
        entry.dialogs.forEach((d) => this.cardQueue.push({ type: d.type, title: d.title, desc: d.desc }));
      } else {
        const a = this.mg.achievements[this.shot];
        this.cardQueue.push({ type: a.type, title: a.title, desc: a.desc });
      }
      this.cardIdx = 0;
      this.cardAch = this.cardQueue[0];
      this.cardDur = Math.max(1.2, Math.min(3, this.cardAch.desc.length * 0.025));
    }

    advanceCard() {
      this.cardIdx++;
      if (this.cardIdx < this.cardQueue.length) {
        this.cardAch = this.cardQueue[this.cardIdx];
        this.cardT = 0;
        this.cardDur = Math.max(1.2, Math.min(3, this.cardAch.desc.length * 0.025));
        IPM.audio.click();
      } else {
        this.endResult();
      }
    }

    endResult() {
      const zone = this.result.zone;
      if (zone !== "miss") {
        this.successes++;
        if (zone === "perfect") this.perfects++;
        this.game.stats.goods++;
        if (zone === "perfect") this.game.stats.perfects++;
        if (this.shot >= this.mg.shots - 1) {
          this.state = "clear";
          this.timer = 0;
          this.game.completeMinigame(this.mg.id);
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
        if (this.resultT >= dur) {
          if (this.result.zone === "miss") this.endResult();
          else {
            this.buildCardQueue();
            this.state = "card";
            this.cardT = 0;
            IPM.audio.card();
          }
        }
      } else if (this.state === "card") {
        this.cardT += dt;
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
        R.text(ctx, "TIRO " + (this.shot + 1) + " DE " + this.mg.shots, W / 2, 205, { size: 18, bold: true, align: "center", color: P.white });
        const blink = Math.floor(this.time * 4) % 2 === 0;
        if (blink) R.text(ctx, "¡PREPÁRATE!", W / 2, 242, { size: 14, align: "center", color: P.yellow });
      } else if (this.state === "aim") {
        this.slider.render(ctx);
        const hint = Math.floor(this.time * 4) % 2 === 0;
        if (hint) R.text(ctx, "¡PRESIONA ESPACIO / TOCA!", W / 2, 352, { size: 11, align: "center", color: P.yellow });
      } else if (this.state === "result") {
        const t = clamp(this.resultT / (this.result.zone === "miss" ? IPM.CONFIG.timings.fail : 1.0), 0, 1);
        if (this.result.zone === "miss") this.theme.drawMiss(ctx, t, this);
        else this.theme.drawHit(ctx, t, this);
        if (this.result.zone === "miss") {
          R.text(ctx, "¡FALLASTE! -1 VIDA", W / 2, 300, { size: 16, bold: true, align: "center", color: P.red });
        }
      } else if (this.state === "card") {
        const typed = clamp(this.cardT / this.cardDur, 0, 1);
        drawCard(ctx, this, Math.min(0.6, this.cardT), typed);
        if (this.cardQueue.length > 1) {
          R.text(ctx, "DIÁLOGO " + (this.cardIdx + 1) + " DE " + this.cardQueue.length, W / 2, 225, { size: 10, bold: true, align: "center", color: P.blue });
        }
        if (typed >= 1 && Math.floor(this.time * 3) % 2 === 0) {
          R.text(ctx, "▶ PRESIONA ESPACIO / TOCA PARA CONTINUAR ◀", W / 2, 250, { size: 11, bold: true, align: "center", color: P.green });
        }
      } else if (this.state === "clear") {
        drawBanner(ctx, "¡NIVEL SUPERADO!", "Perfil del PM más completo · Aciertos " + this.successes + "/" + this.mg.shots, P.yellow);
        const blink = Math.floor(this.time * 3) % 2 === 0;
        if (blink) R.text(ctx, "CARGANDO SIGUIENTE MINIJUEGO...", W / 2, 330, { size: 11, align: "center", color: P.blue });
      } else if (this.state === "gameover") {
        R.rect(ctx, 0, 0, W, H, "rgba(13,14,26,0.75)");
        R.panel(ctx, 190, 112, 420, 240, { fill: P.panel, light: P.red });
        R.text(ctx, "¡SE ACABARON LAS VIDAS!", W / 2, 168, { size: 20, bold: true, align: "center", color: P.red });
        R.text(ctx, "Llegaste al tiro " + (this.shot + 1) + " de " + this.mg.shots, W / 2, 200, { size: 11, align: "center", color: P.white });
        R.text(ctx, this.mg.emoji + " " + this.mg.name, W / 2, 222, { size: 10, align: "center", color: P.orange });
        const opts = ["REINTENTAR", "MENÚ"];
        opts.forEach(function (o, i) {
          const sel = this.goOpt === i;
          R.text(ctx, (sel ? "▶ " : "   ") + o, W / 2, 268 + i * 30, { size: 15, bold: sel, align: "center", color: sel ? P.yellow : P.cream });
        }.bind(this));
        R.text(ctx, "FLECHAS ↑↓ / ESPACIO", W / 2, 340, { size: 9, align: "center", color: P.gray });
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
    handleInput(a, evt) {
      if (a === "tap") a = "fire";
      if (a === "fire") {
        IPM.audio.fanfare();
        this.game.setScene(new Menu(this.game));
      }
    }
    update(dt) { this.time += dt; }
    render(ctx) {
      R.rect(ctx, 0, 0, W, H, P.sky1);
      for (let i = 0; i < 5; i++) R.rect(ctx, 20 + i * 160, 30 + (i % 2) * 20, 4, 4, P.white);
      R.text(ctx, "🏆", W / 2, 58, { size: 30, align: "center", shadow: false });
      R.text(ctx, IPM.PODIUM.title, W / 2, 92, { size: 22, bold: true, align: "center", color: P.yellow });
      R.text(ctx, IPM.PODIUM.intro, W / 2, 114, { size: 10, align: "center", color: P.white });

      const st = this.game.stats;
      R.text(ctx, "PERFECTOS " + st.perfects + " · BUENOS " + st.goods + " · FALLOS " + st.misses + " · ACIERTOS 21/21", W / 2, 136, { size: 10, align: "center", color: P.orange });

      const cols = [IPM.PODIUM.essentials, IPM.PODIUM.industry, IPM.PODIUM.context];
      cols.forEach(function (col, i) {
        const x = 16 + i * 258;
        const y = 148;
        R.panel(ctx, x, y, 250, 300, { fill: i === 0 ? "#3a2b4d" : P.panel });
        R.text(ctx, col.title, x + 125, y + 28, { size: 11, bold: true, align: "center", color: P.yellow });
        R.line(ctx, x + 12, y + 36, x + 238, y + 36, P.black, 2);
        col.items.forEach(function (it, j) {
          const lines = R.wrap(ctx, it, 224, 8);
          let yy = y + 58 + j * 6;
          lines.slice(0, 5).forEach(function (ln) {
            R.text(ctx, ln, x + 12, yy, { size: 8, align: "left", color: P.cream });
            yy += 15;
          });
        });
      });

      const blink = Math.floor(this.time * 2.2) % 2 === 0;
      if (blink) R.text(ctx, "▶ ESPACIO / TOCA PARA VOLVER AL INICIO ◀", W / 2, 444, { size: 12, bold: true, align: "center", color: P.green });
    }
  }

  return { Menu: Menu, Minigame: Minigame, Podium: Podium };
})();
