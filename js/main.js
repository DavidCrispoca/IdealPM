IPM.game = (function () {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = IPM.CONFIG.width;
  const H = IPM.CONFIG.height;

  let current = null;
  let last = 0;

  const game = {
    stats: { perfects: 0, goods: 0, misses: 0 },
    progress: { completed: {} },
    PROGRESS_KEY: "idealpm_progress_v1",
    setScene: function (scene) {
      current = scene;
      if (scene.enter) scene.enter();
    },
    get scene() { return current; },
    isUnlocked: function (mgIndex) {
      if (mgIndex === 0) return true;
      if (mgIndex === 1) return this.progress.completed.basketball === true;
      if (mgIndex === 2) return this.progress.completed.basketball === true && this.progress.completed.football === true;
      return false;
    },
    completeMinigame: function (id) {
      this.progress.completed[id] = true;
      this.saveProgress();
    },
    saveProgress: function () {
      try {
        if (typeof localStorage !== "undefined") localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(this.progress.completed));
      } catch (e) {}
    },
    loadProgress: function () {
      try {
        if (typeof localStorage === "undefined") return;
        const raw = localStorage.getItem(this.PROGRESS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") this.progress.completed = parsed;
        }
      } catch (e) {}
    },
    resetProgress: function () {
      this.progress.completed = {};
      this.saveProgress();
    }
  };

  function onAction(a, evt) {
    IPM.audio.init();
    if (current && current.handleInput) current.handleInput(a, evt);
  }

  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top) * (H / rect.height)
    };
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
      case "x":
      case "X":
      case "r":
      case "R":
        return "reset";
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
      onAction("tap", canvasPos(e));
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
    game.loadProgress();
    if (IPM.sprites && IPM.sprites.preload) IPM.sprites.preload();
    if (IPM.aciertos && IPM.aciertos.load) IPM.aciertos.load();
    bindInput();
    game.setScene(new IPM.scenes.Menu(game));
    last = performance.now();
    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", boot);
  return game;
})();
