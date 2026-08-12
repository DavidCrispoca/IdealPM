IPM.sprites = (function () {
  const defs = {
    basketballBall: {
      w: 24, h: 24,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>" +
        "<circle cx='12' cy='12' r='11' fill='#d97b29'/>" +
        "<path d='M12 1 a11 11 0 0 1 11 11' fill='none' stroke='#8a4a12' stroke-width='1.5'/>" +
        "<path d='M1 12 h22' stroke='#6b3408' stroke-width='1.5'/>" +
        "<path d='M12 1 v22' stroke='#6b3408' stroke-width='1.5'/>" +
        "<ellipse cx='7' cy='7' rx='3' ry='2' fill='#ffb35c' opacity='0.85'/>" +
        "</svg>"
    },
    basketballPlayer: {
      w: 32, h: 48,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'>" +
        "<rect x='10' y='2' width='12' height='12' rx='3' fill='#eab07e' stroke='#8a5a2e' stroke-width='1'/>" +
        "<rect x='10' y='1' width='12' height='5' rx='2' fill='#3a2a1a'/>" +
        "<rect x='17' y='7' width='2' height='2' fill='#1a1a1a'/>" +
        "<path d='M8 14 h16 l1.5 14 h-19 z' fill='#ffd23e' stroke='#c99700' stroke-width='1'/>" +
        "<rect x='3' y='15' width='7' height='10' rx='3' fill='#eab07e' stroke='#8a5a2e' stroke-width='1'/>" +
        "<rect x='22' y='15' width='7' height='10' rx='3' fill='#eab07e' stroke='#8a5a2e' stroke-width='1'/>" +
        "<rect x='8' y='28' width='16' height='9' rx='2' fill='#2b2b45' stroke='#181830' stroke-width='1'/>" +
        "<rect x='9' y='37' width='5' height='9' fill='#eab07e'/>" +
        "<rect x='18' y='37' width='5' height='9' fill='#eab07e'/>" +
        "<rect x='6' y='44' width='10' height='4' rx='1.5' fill='#f8f8f4' stroke='#9aa' stroke-width='1'/>" +
        "<rect x='16' y='44' width='10' height='4' rx='1.5' fill='#f8f8f4' stroke='#9aa' stroke-width='1'/>" +
        "</svg>"
    },
    basketballHoop: {
      w: 44, h: 52,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='52' viewBox='0 0 44 52'>" +
        "<rect x='40' y='4' width='4' height='48' fill='#b9c0d0' stroke='#777' stroke-width='0.5'/>" +
        "<rect x='3' y='1' width='38' height='27' rx='2' fill='#f8f8f4' stroke='#4a4c66' stroke-width='2'/>" +
        "<rect x='10' y='8' width='24' height='14' fill='none' stroke='#ff6b3d' stroke-width='2'/>" +
        "<rect x='6' y='29' width='33' height='5' rx='2' fill='#ff6b3d' stroke='#b8431a' stroke-width='1'/>" +
        "<path d='M8 35 l3 13 M14 35 l3 14 M21 35 l1 14 M28 35 l-3 14 M34 35 l-3 13' stroke='#efefef' stroke-width='1.5'/>" +
        "<path d='M11 49 h21 M8 41 h28 M8 45 h28' stroke='#efefef' stroke-width='1'/>" +
        "</svg>"
    },
    soccerBall: {
      w: 20, h: 20,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>" +
        "<circle cx='10' cy='10' r='9' fill='#f8f8f4' stroke='#555' stroke-width='1'/>" +
        "<path d='M10 4 L15 7 L13 13 L7 13 L5 7 Z' fill='#1a1a1a'/>" +
        "<circle cx='3.5' cy='15' r='2' fill='#1a1a1a'/>" +
        "<circle cx='16' cy='15.5' r='2' fill='#1a1a1a'/>" +
        "<ellipse cx='6' cy='5' rx='2.5' ry='1.5' fill='#ffffff' opacity='0.9'/>" +
        "</svg>"
    },
    soccerKeeper: {
      w: 28, h: 40,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='40' viewBox='0 0 28 40'>" +
        "<rect x='9' y='1' width='10' height='9' rx='2' fill='#eab07e' stroke='#8a5a2e' stroke-width='1'/>" +
        "<rect x='8' y='0' width='12' height='4' rx='1' fill='#2a4d8f'/>" +
        "<rect x='5' y='10' width='18' height='16' rx='2' fill='#5aa9ff' stroke='#2a4d8f' stroke-width='1'/>" +
        "<rect x='2' y='12' width='6' height='12' rx='2' fill='#5aa9ff' stroke='#2a4d8f' stroke-width='1'/>" +
        "<rect x='20' y='12' width='6' height='12' rx='2' fill='#5aa9ff' stroke='#2a4d8f' stroke-width='1'/>" +
        "<rect x='1' y='20' width='7' height='6' rx='1.5' fill='#f8f8f4' stroke='#9aa' stroke-width='1'/>" +
        "<rect x='20' y='20' width='7' height='6' rx='1.5' fill='#f8f8f4' stroke='#9aa' stroke-width='1'/>" +
        "<rect x='7' y='26' width='14' height='8' rx='1.5' fill='#2b2b45'/>" +
        "<rect x='8' y='34' width='5' height='5' fill='#eab07e'/>" +
        "<rect x='15' y='34' width='5' height='5' fill='#eab07e'/>" +
        "<rect x='6' y='38' width='8' height='2' fill='#2b2b45'/>" +
        "<rect x='14' y='38' width='8' height='2' fill='#2b2b45'/>" +
        "</svg>"
    },
    soccerGoal: {
      w: 64, h: 52,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='52' viewBox='0 0 64 52'>" +
        "<defs><pattern id='net' width='8' height='8' patternUnits='userSpaceOnUse'>" +
        "<path d='M0 8 L8 0' stroke='#cfcfcf' stroke-width='1'/>" +
        "<path d='M0 0 L8 8' stroke='#cfcfcf' stroke-width='1'/>" +
        "</pattern></defs>" +
        "<rect x='7' y='7' width='50' height='44' fill='url(#net)'/>" +
        "<rect x='1' y='1' width='6' height='50' rx='1' fill='#f8f8f4' stroke='#666' stroke-width='1'/>" +
        "<rect x='57' y='1' width='6' height='50' rx='1' fill='#f8f8f4' stroke='#666' stroke-width='1'/>" +
        "<rect x='1' y='1' width='62' height='6' rx='1' fill='#f8f8f4' stroke='#666' stroke-width='1'/>" +
        "</svg>"
    },
    targetBoard: {
      w: 56, h: 56,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'>" +
        "<circle cx='28' cy='28' r='26' fill='#f8f8f4' stroke='#444' stroke-width='1'/>" +
        "<circle cx='28' cy='28' r='20' fill='#1a1a1a'/>" +
        "<circle cx='28' cy='28' r='15' fill='#5aa9ff'/>" +
        "<circle cx='28' cy='28' r='10' fill='#e0434d'/>" +
        "<circle cx='28' cy='28' r='5' fill='#ffd23e'/>" +
        "<ellipse cx='22' cy='20' rx='9' ry='4' fill='#ffffff' opacity='0.18'/>" +
        "</svg>"
    },
    archeryArrow: {
      w: 10, h: 44,
      svg: "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='44' viewBox='0 0 10 44'>" +
        "<rect x='4' y='6' width='2' height='34' fill='#7a4a2c'/>" +
        "<rect x='3' y='1' width='4' height='8' rx='1' fill='#c8ccd8' stroke='#666' stroke-width='0.5'/>" +
        "<rect x='1' y='38' width='8' height='5' fill='#e0434d'/>" +
        "<rect x='2' y='32' width='6' height='6' fill='#f8f8f4'/>" +
        "</svg>"
    }
  };

  const cache = {};

  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function rasterize(url, w, h) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () {
        const c = makeCanvas(w, h);
        const x = c.getContext("2d");
        x.imageSmoothingEnabled = false;
        x.drawImage(img, 0, 0, w, h);
        resolve(c);
      };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  function svgSprite(def) {
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(def.svg);
    return rasterize(url, def.w, def.h);
  }

  function loadExternal(url) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  async function preload() {
    const external = IPM.CONFIG.spriteURLs || {};
    for (const key of Object.keys(defs)) {
      const img = external[key] ? await loadExternal(external[key]) : null;
      if (img) {
        const c = makeCanvas(defs[key].w, defs[key].h);
        const x = c.getContext("2d");
        x.imageSmoothingEnabled = false;
        x.drawImage(img, 0, 0, defs[key].w, defs[key].h);
        cache[key] = c;
      } else {
        const c = await svgSprite(defs[key]);
        if (c) cache[key] = c;
      }
    }
  }

  function ready(key) { return !!cache[key]; }

  function draw(ctx, key, x, y, scale) {
    const c = cache[key];
    if (!c) return false;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(c, Math.round(x), Math.round(y), c.width * (scale || 1), c.height * (scale || 1));
    ctx.restore();
    return true;
  }

  function drawCentered(ctx, key, cx, cy, scale) {
    const c = cache[key];
    if (!c) return false;
    const s = scale || 1;
    return draw(ctx, key, cx - (c.width * s) / 2, cy - (c.height * s) / 2, s);
  }

  return {
    preload: preload,
    ready: ready,
    draw: draw,
    drawCentered: drawCentered
  };
})();
