const fs = require("fs");
const vm = require("vm");
const path = require("path");

const dir = path.join(__dirname, "..", "js");
const files = ["config.js", "aciertos.js", "audio.js", "render.js", "slider.js", "scenes.js"];
let code = "";
for (const f of files) {
  if (f === "scenes.js") {
    code += "IPM.sprites = { ready: () => false, draw: () => false, drawCentered: () => false, preload: () => Promise.resolve() };\n";
  }
  code += fs.readFileSync(path.join(dir, f), "utf8") + "\n";
}

const sandbox = {
  console, Math, Date, Promise,
  window: { addEventListener() {} },
  requestAnimationFrame() {},
  performance: { now: () => 0 }
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const IPM = vm.runInContext("IPM", sandbox);

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error("FAIL: " + msg); }
  else console.log("OK  : " + msg);
}

const md = fs.readFileSync(path.join(__dirname, "..", "aciertos.md"), "utf8");
const parsed = IPM.aciertos.parse(md);

assert(parsed.basketball && parsed.football && parsed.archery, "se parsean los 3 minijuegos del documento");
assert(parsed.basketball.length === 4, "basketball: 4 cestas definidas");
assert(parsed.football.length === 4, "football: 4 disparos definidos");
assert(parsed.archery.length === 4, "archery: 4 dianas definidas");
assert(parsed.basketball[0].dialogs.length === 2, "basketball cesta 1: 2 dialogos");
assert(parsed.football[0].dialogs.length === 2, "football disparo 1: 2 dialogos");
assert(parsed.archery[0].dialogs.length === 1, "archery diana 1: dialogo unico");

const b1 = parsed.basketball[0].dialogs[0];
assert(b1.type === "HABILIDAD TÉCNICA" && b1.desc.indexOf("Identificación") === 0, "basketball cesta1 dialogo1 contenido");
assert(parsed.basketball[0].dialogs[1].type === "HABILIDAD BLANDA" && parsed.basketball[0].dialogs[1].desc.length > 0, "basketball cesta1 dialogo2 contenido");
assert(parsed.football[0].dialogs[1].type === "CERTIFICACIÓN RECOMENDADA" && parsed.football[0].dialogs[1].desc.indexOf("Project Management Professional") === 0, "football disparo1 dialogo2 certificacion");
assert(parsed.archery[3].dialogs[0].desc.indexOf("Integridad") === 0, "archery diana4 contenido");

// carga y datos vivos
assert(IPM.aciertos.data === null, "data nula antes de cargar");
IPM.aciertos.data = parsed;

const game = {
  stats: { perfects: 0, goods: 0, misses: 0 },
  progress: { completed: {} },
  isUnlocked(i) { return i === 0; },
  completeMinigame(id) {},
  resetProgress() {},
  setScene(s) { this.scene = s; }
};
function makeCtx() {
  const ctx = {
    save() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
    arc() {}, ellipse() {}, rotate() {}, translate() {}, closePath() {}, fill() {},
    fillRect() {}, strokeRect() {},
    createLinearGradient() { return { addColorStop() {} }; },
    fillText() {},
    measureText(str) { return { width: String(str).length * 6 }; },
    set font(v) {}, set textAlign(v) {}, set textBaseline(v) {},
    set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set globalAlpha(v) {}
  };
  return new Proxy(ctx, {
    get(t, p) { if (!(p in t)) throw new Error("ctx no soportado: " + String(p)); return t[p]; },
    set(t, p, v) { if (!(p in t)) throw new Error("ctx prop no soportada: " + String(p)); t[p] = v; return true; }
  });
}

const mg = new IPM.scenes.Minigame(game, 0);
mg.shot = 0;
mg.buildCardQueue();
assert(mg.cardQueue.length === 2, "tiro 1 -> cola con 2 dialogos de aciertos.md");
assert(mg.cardAch.type === "HABILIDAD TÉCNICA" && mg.cardAch.desc.indexOf("Identificación") === 0, "card actual = dialogo 1 de aciertos.md");
mg.cardT = mg.cardDur + 0.5;
try { mg.render(makeCtx()); assert(true, "tarjeta renderiza el dialogo de aciertos.md"); }
catch (e) { assert(false, "tarjeta falla al renderizar: " + e.message); }

mg.shot = 6;
mg.buildCardQueue();
assert(mg.cardQueue.length === 1 && mg.cardAch.desc === IPM.MINIGAMES[0].achievements[6].desc, "tiro 7 -> respaldo de config.js");

console.log("\n" + (failures ? "RESULTADO: " + failures + " FALLO(S)" : "RESULTADO: ACIERTOS OK"));
process.exit(failures ? 1 : 0);
