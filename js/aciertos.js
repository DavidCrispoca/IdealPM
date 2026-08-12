// aciertos.js — carga los diálogos por acierto desde aciertos.md
// Formato del documento (ver aciertos.md):
//   ## <emoji> <NIVEL...>              -> minijuego (mapeo por emoji)
//   ### <emoji> Cesta/Disparo/Diana N  -> acierto (orden = número de tiro)
//   - **Título:**                       -> etiqueta del diálogo (categoría derivada)
//   > *"texto."*                        -> contenido (blockquote)
// Los aciertos sin entrada en el documento usan los logros de config.js.
IPM.aciertos = (function () {
  var MG_EMOJI = { "🏀": "basketball", "⚽": "football", "🎯": "archery" };
  var MG_DIALOG_TYPES = {
    basketball: ["HABILIDAD TÉCNICA", "HABILIDAD BLANDA"],
    football: ["COMPETENCIA CLAVE", "CERTIFICACIÓN RECOMENDADA"],
    archery: ["ATRIBUTO PERSONAL"]
  };

  function cleanText(s) {
    return String(s)
      .replace(/^>\s*/, "")
      .replace(/^\*+/, "")
      .replace(/\*+$/, "")
      .replace(/^["""]+|["""]+$/g, "")
      .trim();
  }

  function parse(md) {
    var out = {};
    var mg = null;
    var entry = null;
    var dialog = null;
    var lines = String(md || "").split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      if (/^##\s/.test(line)) {
        mg = null; entry = null; dialog = null;
        var head = line.slice(2);
        for (var e in MG_EMOJI) {
          if (MG_EMOJI.hasOwnProperty(e) && head.indexOf(e) !== -1) {
            mg = MG_EMOJI[e];
            out[mg] = out[mg] || [];
          }
        }
      } else if (/^###\s/.test(line) && mg) {
        entry = { label: line.replace(/^###\s*/, "").trim(), dialogs: [] };
        out[mg].push(entry);
        dialog = null;
      } else if (entry) {
        var mBullet = line.match(/^-\s*\*\*(.+?)\*\*\s*:?\s*$/);
        if (mBullet) {
          dialog = {};
          var rest = mBullet[1].trim().replace(/\s*:$/, "");
          var types = MG_DIALOG_TYPES[mg];
          dialog.title = rest;
          dialog.type = types && types[entry.dialogs.length] ? types[entry.dialogs.length] : "ACCIÓN";
          dialog.desc = "";
          entry.dialogs.push(dialog);
        } else if (dialog && /^>/.test(line)) {
          var txt = cleanText(line);
          if (txt) dialog.desc = dialog.desc ? dialog.desc + " " + txt : txt;
        }
      }
    }
    return out;
  }

  var data = null;
  function load() {
    if (typeof fetch !== "function") return Promise.resolve(null);
    return fetch("aciertos.md")
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        return r.text();
      })
      .then(function (md) { data = parse(md); return data; })
      .catch(function () { return null; });
  }

  return { parse: parse, load: load, get data() { return data; }, set data(v) { data = v; } };
})();
