const fs = require("fs");
const vm = require("vm");
const path = require("path");

const dir = path.join(__dirname, "..", "js");
const files = ["config.js", "audio.js", "render.js", "slider.js", "scenes.js"];
let code = "";
for (const f of files) {
  if (f === "scenes.js") {
    code += "IPM.sprites = { ready: () => false, draw: () => false, drawCentered: () => false, preload: () => Promise.resolve() };\n";
  }
  code += fs.readFileSync(path.join(dir, f), "utf8") + "\n";
}

const sandbox = {
  console, Math, Date,
  window: { addEventListener() {} },
  requestAnimationFrame() {},
  performance: { now: () => 0 }
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const IPM = vm.runInContext("IPM", sandbox);

function makeCtx() {
  const ctx = {
    save() {}, restore() {},
    beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
    arc() {}, ellipse() {}, rotate() {}, translate() {}, closePath() {}, fill() {},
    fillRect() {}, strokeRect() {},
    createLinearGradient() { return { addColorStop() {} }; },
    fillText(str, x, y) { if (typeof str !== "string") throw new Error("fillText sin string: " + str); },
    measureText(str) { return { width: String(str).length * 6 }; },
    set font(v) {}, set textAlign(v) {}, set textBaseline(v) {},
    set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set globalAlpha(v) {}
  };
  return new Proxy(ctx, {
    get(t, p) { if (!(p in t)) throw new Error("metodo ctx no soportado: " + String(p)); return t[p]; },
    set(t, p, v) { if (!(p in t)) throw new Error("propiedad ctx no soportada: " + String(p)); t[p] = v; return true; }
  });
}

const game = {
  stats: { perfects: 0, goods: 0, misses: 0 },
  progress: { completed: { basketball: true, football: true } },
  isUnlocked(i) {
    if (i === 0) return true;
    if (i === 1) return this.progress.completed.basketball === true;
    if (i === 2) return this.progress.completed.basketball === true && this.progress.completed.football === true;
    return false;
  },
  completeMinigame(id) { this.progress.completed[id] = true; },
  resetProgress() { this.progress.completed = {}; },
  setScene(s) { this.scene = s; if (s.enter) s.enter(); }
};

let failures = 0;
function render(label, scene) {
  try {
    const ctx = makeCtx();
    if (scene.update) scene.update(0.016);
    scene.render(ctx);
    console.log("OK  : render " + label);
  } catch (e) {
    failures++;
    console.error("FAIL: render " + label + " -> " + e.message);
  }
}

game.setScene(new IPM.scenes.Menu(game));
render("menu", game.scene);

for (const idx of [0, 1, 2]) {
  const id = IPM.MINIGAMES[idx].id;
  const mg = new IPM.scenes.Minigame(game, idx);
  mg.state = "intro"; mg.timer = 0; render(id + " intro", mg);
  mg.state = "aim"; mg.slider.start(); render(id + " aim", mg);
  mg.state = "result"; mg.result = { zone: "perfect", value: 0.5 }; mg.resultT = 1.5; mg.cardAch = mg.mg.achievements[0]; render(id + " result perfect", mg);
  mg.state = "result"; mg.result = { zone: "good", value: 0.35 }; mg.resultT = 1.5; mg.cardAch = mg.mg.achievements[1]; render(id + " result good", mg);
  mg.state = "result"; mg.result = { zone: "miss", value: 0.1 }; mg.resultT = 1.0; render(id + " result miss", mg);
  mg.state = "card"; mg.cardT = 0.6; mg.cardAch = mg.mg.achievements[0]; render(id + " card escribiendo", mg);
  mg.state = "card"; mg.cardT = 5.0; mg.cardAch = mg.mg.achievements[0]; render(id + " card lista", mg);
  const LONG_DESC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
  mg.state = "card"; mg.cardT = 0.6; mg.cardAch = { type: "TÉCNICA", title: "Título de longitud considerable para forzar el ajuste dentro de la tarjeta de diálogo", desc: LONG_DESC }; render(id + " card desc larga escribiendo", mg);
  mg.state = "card"; mg.cardT = 5.0; mg.cardAch = { type: "TÉCNICA", title: "Título de longitud considerable para forzar el ajuste dentro de la tarjeta de diálogo", desc: LONG_DESC }; render(id + " card desc larga lista", mg);
  mg.state = "clear"; mg.timer = 0; render(id + " clear", mg);
  mg.state = "gameover"; render(id + " gameover", mg);
}

game.setScene(new IPM.scenes.Podium(game));
render("podium", game.scene);

game.resetProgress();
game.setScene(new IPM.scenes.Menu(game));
render("menu con bloqueos", game.scene);

let drawn = 0;
IPM.sprites = {
  ready: () => true,
  draw: () => { drawn++; return true; },
  drawCentered: () => { drawn++; return true; },
  preload: () => Promise.resolve()
};
for (const idx of [0, 1, 2]) {
  const id = IPM.MINIGAMES[idx].id;
  const mg = new IPM.scenes.Minigame(game, idx);
  mg.state = "intro"; mg.timer = 0; render(id + " intro sprites", mg);
  mg.state = "aim"; mg.slider.start(); render(id + " aim sprites", mg);
  mg.state = "result"; mg.result = { zone: "perfect", value: 0.5 }; mg.resultT = 1.5; mg.cardAch = mg.mg.achievements[0]; render(id + " result sprites", mg);
  mg.state = "result"; mg.result = { zone: "miss", value: 0.1 }; mg.resultT = 1.0; render(id + " result miss sprites", mg);
  mg.state = "card"; mg.cardT = 5.0; mg.cardAch = mg.mg.achievements[0]; render(id + " card sprites", mg);
}
console.log("OK  : drawCentered invocado " + drawn + " veces con sprites listos");
if (drawn < 10) { failures++; console.error("FAIL: los sprites listos deberian dibujarse"); }

console.log("\n" + (failures ? "RESULTADO: " + failures + " FALLO(S)" : "RESULTADO: TODO RENDERIZA SIN ERRORES"));
process.exit(failures ? 1 : 0);
