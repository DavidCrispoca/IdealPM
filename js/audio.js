IPM.audio = (function () {
  let ctx = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    if (!ensure()) return;
    const t0 = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(vol || 0.12, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  }

  return {
    init: ensure,
    click: function () { tone(600, 0.08, "square", 0.07); },
    perfect: function () {
      tone(880, 0.12, "square", 0.15);
      tone(1320, 0.22, "square", 0.12, 0.09);
    },
    good: function () {
      tone(660, 0.12, "square", 0.14);
      tone(880, 0.18, "square", 0.11, 0.08);
    },
    miss: function () {
      tone(220, 0.25, "sawtooth", 0.15, 0, 80);
      tone(140, 0.3, "square", 0.11, 0.05, 55);
    },
    fanfare: function () {
      [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.16, "square", 0.13, i * 0.12); });
      tone(1568, 0.45, "square", 0.11, 0.5);
    },
    gameOver: function () {
      [392, 330, 262, 196].forEach(function (f, i) { tone(f, 0.28, "sawtooth", 0.12, i * 0.18); });
    },
    card: function () {
      tone(784, 0.1, "triangle", 0.12);
      tone(1047, 0.14, "triangle", 0.1, 0.08);
    }
  };
})();
