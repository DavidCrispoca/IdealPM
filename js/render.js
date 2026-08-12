IPM.render = (function () {
  const PALETTE = {
    bgDark: "#14162b",
    bgMid: "#232848",
    sky1: "#2a2f5a",
    sky2: "#3a3f7a",
    panel: "#2f3560",
    panelLight: "#3c4373",
    white: "#f8f8f4",
    cream: "#e6d8b8",
    black: "#0d0e1a",
    red: "#e0434d",
    redDark: "#8f2b33",
    green: "#63d66b",
    greenDark: "#2c8a3e",
    yellow: "#ffd23e",
    orange: "#ff9c3e",
    blue: "#5aa9ff",
    blueDark: "#2a4d8f",
    purple: "#b06ae0",
    brown: "#8a5a2e",
    wood: "#7a4a2c",
    gray: "#7a7c99",
    skin: "#f2c89a",
    hair: "#3a2a1a"
  };

  function round(n) { return Math.round(n); }

  function text(ctx, str, x, y, opts) {
    opts = opts || {};
    const size = opts.size || 10;
    const color = opts.color || PALETTE.white;
    const align = opts.align || "left";
    const shadow = opts.shadow !== false;
    ctx.save();
    ctx.font = (opts.bold ? "bold " : "") + size + "px '" + (opts.font || "Courier New") + "', monospace";
    ctx.textAlign = align;
    ctx.textBaseline = opts.baseline || "alphabetic";
    if (shadow) {
      ctx.fillStyle = PALETTE.black;
      ctx.fillText(str, round(x) + 2, round(y) + 2);
    }
    ctx.fillStyle = color;
    ctx.fillText(str, round(x), round(y));
    ctx.restore();
  }

  function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(round(x), round(y), round(w), round(h));
  }

  function rectOutline(ctx, x, y, w, h, color, line) {
    ctx.strokeStyle = color;
    ctx.lineWidth = line || 2;
    ctx.strokeRect(round(x), round(y), round(w), round(h));
  }

  function panel(ctx, x, y, w, h, opts) {
    opts = opts || {};
    rect(ctx, x, y, w, h, opts.fill || PALETTE.panel);
    rectOutline(ctx, x, y, w, h, PALETTE.black, 3);
    rectOutline(ctx, x + 3, y + 3, w - 6, h - 6, opts.light || PALETTE.panelLight, 2);
  }

  function line(ctx, x1, y1, x2, y2, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 2;
    ctx.beginPath();
    ctx.moveTo(round(x1), round(y1));
    ctx.lineTo(round(x2), round(y2));
    ctx.stroke();
  }

  function pixelate(ctx, sprite, x, y, scale) {
    scale = scale || 1;
    const px = round(x);
    const py = round(y);
    for (let row = 0; row < sprite.length; row++) {
      const lineStr = sprite[row];
      for (let col = 0; col < lineStr.length; col++) {
        const ch = lineStr[col];
        if (ch === "." || ch === " ") continue;
        rect(ctx, px + col * scale, py + row * scale, scale, scale, PALETTE[ch] || ch);
      }
    }
  }

  function wrap(ctx, str, maxW, size) {
    const words = str.split(" ");
    const lines = [];
    let cur = "";
    ctx.font = size + "px 'Courier New', monospace";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function quad(t, a, b, c) {
    const u = 1 - t;
    return u * u * a + 2 * u * t * b + t * t * c;
  }

  return {
    PALETTE: PALETTE,
    round: round,
    text: text,
    rect: rect,
    rectOutline: rectOutline,
    panel: panel,
    line: line,
    pixelate: pixelate,
    wrap: wrap,
    quad: quad
  };
})();
