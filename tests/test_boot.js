const fs = require("fs");
const vm = require("vm");
const path = require("path");

const dir = path.join(__dirname, "..", "js");
const files = ["config.js", "aciertos.js", "audio.js", "render.js", "slider.js", "scenes.js", "main.js"];
let code = "";
for (const f of files) {
  if (f === "scenes.js") {
    code += "IPM.sprites = { ready: () => false, draw: () => false, drawCentered: () => false, preload: () => Promise.resolve() };\n";
  }
  code += fs.readFileSync(path.join(dir, f), "utf8") + "\n";
}

const handlers = {};
const ctxStub = {
  save() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
  arc() {}, ellipse() {}, rotate() {}, translate() {}, closePath() {}, fill() {},
  fillRect() {}, strokeRect() {}, fillText() {}, clearRect() {},
  measureText(s) { return { width: String(s).length * 6 }; },
  set font(v) {}, set textAlign(v) {}, set textBaseline(v) {},
  set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {}, set globalAlpha(v) {}
};

const sandbox = {
  console, Math, Date,
  performance: { now: () => 1000 },
  requestAnimationFrame(cb) { return 0; },
  window: {
    addEventListener(type, cb) { handlers[type] = cb; }
  },
  document: {
    getElementById(id) {
      if (id === "game") {
        return {
          width: 0, height: 0,
          getContext: () => ctxStub,
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 450 }),
          addEventListener(type, cb) { handlers["canvas:" + type] = cb; }
        };
      }
      throw new Error("elemento inesperado: " + id);
    }
  }
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const IPM = vm.runInContext("IPM", sandbox);

function fire(type, evt) {
  const cb = handlers[type];
  if (!cb) throw new Error("sin handler: " + type);
  cb(evt);
}

fire("DOMContentLoaded", {});
const game = vm.runInContext("IPM.game", sandbox);
if (!game.scene) throw new Error("game.scene no inicializado tras boot");
console.log("OK  : boot inicializa escena " + game.scene.constructor.name);

fire("keydown", { key: " ", repeat: false, preventDefault() {} });
console.log("OK  : tecla espacio inicia el juego -> " + game.scene.constructor.name);
if (game.scene.constructor.name !== "Minigame") throw new Error("deberia estar en minijuego");

let scene = game.scene;
let guard = 0;
while (scene.state !== "aim" && guard++ < 200) scene.update(0.016);
fire("canvas:pointerdown", { clientX: 400, clientY: 240, preventDefault() {} });
if (!(scene.state === "result" || scene.state === "aim")) throw new Error("esperado result/aim, estado=" + scene.state);
console.log("OK  : tap en canvas dispara (" + scene.state + ")");

console.log("\nRESULTADO: BOOT E INPUT OK");
