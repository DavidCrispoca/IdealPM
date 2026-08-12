IPM.game = (function () {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = IPM.CONFIG.width;
  const H = IPM.CONFIG.height;

  let current = null;
  let last = 0;

  const game = {
    stats: { perfects: 0, goods: 0, misses: 0 },
    setScene: function (scene) {
      current = scene;
      if (scene.enter) scene.enter();
    },
    get scene() { return current; }
  };

  function onAction(a) {
    IPM.audio.init();
    if (current && current.handleInput) current.handleInput(a);
  }

  function keyAction(key) {
    switch (key) {
      case " ":
      case "Spacebar":
      case "Enter":
        return "fire";
      case "ArrowUp":
      case "w":
      case "W":
        return "up";
      case "ArrowDown":
      case "s":
      case "S":
        return "down";
      case "ArrowLeft":
      case "a":
      case "A":
        return "left";
      case "ArrowRight":
      case "d":
      case "D":
        return "right";
      default:
        return null;
    }
  }

  function bindInput() {
    window.addEventListener("keydown", function (e) {
      if (e.repeat) return;
      const a = keyAction(e.key);
      if (a) {
        e.preventDefault();
        onAction(a);
      }
    });
    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      onAction("fire");
    });
  }

  function loop(ts) {
    const dt = Math.min((ts - last) / 1000 || 0, 0.05);
    last = ts;
    if (current) {
      if (current.update) current.update(dt);
      ctx.clearRect(0, 0, W, H);
      if (current.render) current.render(ctx);
    }
    requestAnimationFrame(loop);
  }

  function boot() {
    canvas.width = W;
    canvas.height = H;
    bindInput();
    game.setScene(new IPM.scenes.Menu(game));
    last = performance.now();
    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", boot);
  return game;
})();
