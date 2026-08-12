const fs = require("fs");
const vm = require("vm");
const path = require("path");

const dir = path.join(__dirname, "..", "js");
const files = ["config.js", "sprites.js"];
let code = "";
for (const f of files) code += fs.readFileSync(path.join(dir, f), "utf8") + "\n";

class FakeImage {
  constructor() { this._src = null; }
  set src(v) {
    this._src = v;
    setTimeout(() => {
      if (typeof v === "string" && v.indexOf("data:image/svg+xml") === 0) {
        if (this.onload) this.onload();
      } else if (this.onerror) {
        this.onerror();
      }
    }, 0);
  }
  get src() { return this._src; }
}

const canvases = [];
function fakeCanvas(w, h) {
  const ctx = {
    drawImage() {},
    set imageSmoothingEnabled(v) {},
    get imageSmoothingEnabled() { return false; }
  };
  const c = { width: w, height: h, getContext: () => ctx };
  canvases.push(c);
  return c;
}

const sandbox = {
  console, Math, Promise, encodeURIComponent, setTimeout,
  document: { createElement: (t) => (t === "canvas" ? fakeCanvas(0, 0) : {}) },
  Image: FakeImage
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const IPM = vm.runInContext("IPM", sandbox);

(async () => {
  await IPM.sprites.preload();
  const keys = ["basketballBall", "basketballPlayer", "basketballHoop", "soccerBall", "soccerKeeper", "soccerGoal", "targetBoard", "archeryArrow"];
  let ok = true;
  for (const k of keys) {
    const r = IPM.sprites.ready(k);
    console.log((r ? "OK  : " : "FAIL: ") + k);
    if (!r) ok = false;
  }
  console.log("\nCanvases rasterizados: " + canvases.length);
  console.log(ok ? "RESULTADO: SPRITES OK" : "RESULTADO: HAY SPRITES FALLIDOS");
  process.exit(ok ? 0 : 1);
})();
