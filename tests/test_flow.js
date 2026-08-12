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

IPM.CONFIG.slider.randomize = false;

const game = {
  stats: { perfects: 0, goods: 0, misses: 0 },
  progress: { completed: {} },
  isUnlocked(i) {
    if (i === 0) return true;
    if (i === 1) return this.progress.completed.basketball === true;
    if (i === 2) return this.progress.completed.basketball === true && this.progress.completed.football === true;
    return false;
  },
  completeMinigame(id) { this.progress.completed[id] = true; },
  resetProgress() { this.progress.completed = {}; },
  setScene(scene) {
    this.scene = scene;
    if (scene.enter) scene.enter();
  }
};

function step(scene, iterations) {
  for (let i = 0; i < (iterations || 2000); i++) {
    if (!scene.update) break;
    scene.update(0.016);
  }
  return game.scene;
}

function forceAim(scene) {
  let guard = 0;
  while (scene.state !== "aim" && guard++ < 500) scene.update(0.016);
  if (scene.state !== "aim") throw new Error("no llego a aim, estado=" + scene.state);
}

function dismissCards(scene) {
  let guard = 0;
  while (scene.state === "card" && guard++ < 12) {
    if (scene.cardT < scene.cardDur) scene.handleInput("fire");
    scene.handleInput("fire");
  }
}

function assert(cond, msg) {
  if (!cond) { console.error("FAIL: " + msg); process.exitCode = 1; }
  else console.log("OK  : " + msg);
}

game.setScene(new IPM.scenes.Menu(game));
assert(game.scene instanceof IPM.scenes.Menu, "menu inicial");
assert(game.scene.unlocked().join(",") === "0", "solo basketball desbloqueado al inicio");

game.scene.handleInput("fire");
assert(game.scene instanceof IPM.scenes.Minigame, "fire del menu -> minijuego 0");
assert(game.scene.mgIndex === 0, "minijuego 0 = basketball");

let totalPerfect = 0;
let minigamesDone = 0;
let guard = 0;
while (minigamesDone < 3 && guard++ < 1000) {
  const s = game.scene;
  if (!(s instanceof IPM.scenes.Minigame)) { throw new Error("escena inesperada: " + s.constructor.name); }
  forceAim(s);
  s.slider.needle = 0.5;
  s.handleInput("fire");
  assert(s.state === "result", "tiro disparado en " + s.mg.id);
  assert(s.cardAch !== null, "accion desbloqueada asignada en el disparo (" + s.mg.id + ")");
  step(s, 160);
  assert(s.state === "card", "tras el resultado se entra al dialogo de tarjeta (" + s.mg.id + ")");
  assert(s.cardQueue.length >= 1, "cola de dialogos construida (" + s.mg.id + ")");
  assert(s.cardT > 0 && s.cardT < s.cardDur, "escribiendo: cardT parcial (" + s.mg.id + ")");
  dismissCards(s);
  assert(s.state !== "card", "dialogo(s) cerrado(s) con input (" + s.mg.id + ")");
  step(s, 300);
  if (game.scene !== s) {
    minigamesDone++;
    totalPerfect += s.perfects;
  }
}
assert(minigamesDone === 3, "3 minijuegos superados");
assert(game.scene instanceof IPM.scenes.Podium, "llega al podio tras los 3 minijuegos");
assert(game.progress.completed.basketball === true, "basketball marcado como completado");
assert(game.progress.completed.football === true, "football marcado como completado");
assert(game.progress.completed.archery === true, "archery marcado como completado");
assert(totalPerfect === 12, "12 tiros perfectos acumulados");
assert(game.stats.perfects === 12 && game.stats.goods === 12 && game.stats.misses === 0, "stats: 12 perfectos, 12 buenos, 0 fallos");

game.scene.handleInput("fire");
assert(game.scene instanceof IPM.scenes.Menu, "podio -> menu");

game.setScene(new IPM.scenes.Minigame(game, 0));
let s = game.scene;
forceAim(s);
s.slider.needle = 0.0;
const shotBefore = s.shot;
const attemptsBefore = s.attempts;
s.handleInput("fire");
step(s);
assert(s.state === "intro" || s.state === "aim", "tras fallo reintenta el tiro (intro o aim)");
assert(s.shot === shotBefore + 1, "el tiro avanza al fallar");
assert(s.attempts === attemptsBefore - 1, "consume 1 intento al fallar");
assert(game.stats.misses === 1, "stats: 1 fallo registrado");

forceAim(s);
let guard2 = 0;
while (game.scene === s && s.state !== "gameover" && guard2++ < 40) {
  if (s.state === "aim") { s.slider.needle = 0.0; s.handleInput("fire"); }
  step(s, 200);
}
assert(s.state === "gameover", "gameover al agotar vidas");
assert(s.attempts === 0, "0 intentos restantes");

const prevOpt = s.goOpt;
s.handleInput("down");
assert(s.goOpt !== prevOpt, "navegacion de opciones en gameover");

game.resetProgress();
game.setScene(new IPM.scenes.Menu(game));
let menu = game.scene;
assert(menu.unlocked().join(",") === "0", "inicio: solo basketball");
menu.handleInput("tap", { x: 400, y: 240 });
assert(menu.lockMsg === true, "tap en card bloqueada muestra mensaje de bloqueo");
game.completeMinigame("basketball");
menu = new IPM.scenes.Menu(game);
assert(menu.unlocked().join(",") === "0,1", "tras basketball se desbloquea football");
game.completeMinigame("football");
menu = new IPM.scenes.Menu(game);
assert(menu.unlocked().join(",") === "0,1,2", "tras football se desbloquea archery");

console.log("\nRESULTADO: " + (process.exitCode ? "HAY FALLOS" : "TODAS LAS PRUEBAS PASARON"));
