# Plan de implementación — IdealPM (MVP)

## Objetivo
Juego web estático jugable (HTML5 Canvas + JS ES6 + CSS3 + Web Audio API, cero
dependencias) desplegable en GitHub Pages como `https://<usuario>.github.io/IdealPM/`.

## Alcance
- 3 minijuegos: 🏀 Basketball, ⚽ Fútbol (penaltis), 🎯 Tiro al blanco.
- Por minijuego: 10 vidas, 7 tiros. Slider de timing (zona verde/amarilla/roja).
- Control: ESPACIO / CLICK / TAP. HUD con vidas ❤️ y "Tiro X de 7".
- Popup de tarjeta retro por acierto desbloqueado (contenido en config.js, SIN Aciertos.md).
- Podio final con perfil completo y las 3 reflexiones estratégicas.
- Pixel-art procedural en Canvas (sin spritesheets ni assets externos).
- Sonido sintetizado con Web Audio API (requiere primer gesto del usuario).

## Estructura de archivos
```
IdealPM/
├── index.html        # Contenedor canvas + overlay HUD
├── plan.md           # Este documento
├── css/styles.css    # Tema retro 8-bit, 16:9, responsive táctil
├── js/
│   ├── main.js       # Boot + máquina de estados (MENÚ→🏀→⚽→🎯→PODIO)
│   ├── config.js     # JSON config (10 vidas/7 tiros) + aciertos embebidos
│   ├── slider.js     # Aguja oscilante + zonas + evaluación de tiro
│   ├── audio.js      # Synth Web Audio (acierto/fallo/fanfarria)
│   ├── render.js     # Paleta + helpers pixel-art procedural
│   └── scenes.js     # Escenas: menú, basketball, fútbol, arquería, podio
└── Inspo/            # Referencias visuales (no se usan en el juego)
```

## Pasos hasta finalizar
1. [x] Crear `plan.md` y estructura de carpetas (css/js).
2. [x] `index.html` + `css/styles.css`: layout 16:9, pixel font, overlay HUD.
3. [x] `js/config.js`: JSON global (gameName, lives=10, shots=7) + aciertos de
       los 3 minijuegos + textos del podio (spec §4, §5).
4. [x] `js/audio.js`: sintetizador (beep perfecto, buen tiro, fallo, fanfarria).
5. [x] `js/slider.js`: núcleo de timing — aguja oscilante, zonas
       verde/amarilla/roja, evento de tiro, retry del tiro fallido (−1 vida).
6. [x] `js/render.js`: utilidades pixel-art (escalado, paleta, rects, textos).
7. [x] `js/main.js`: bucle de juego (requestAnimationFrame), input teclado/
       táctil, máquina de estados y transiciones.
8. [x] Escena Basketball: canasta lateral, animación de enceste/fallo,
       popup con habilidad desbloqueada.
9. [x] Escena Fútbol: portería + arquero, animación gol/atajada, popup.
10. [x] Escena Tiro al blanco: diana frontal, flecha, animación centro/madera,
        popup.
11. [x] HUD unificado: ❤️ x10, "Tiro X de 7" con 🏀/⚽/🎯, contador de aciertos.
12. [x] Escena Podio: perfil completo + 3 reflexiones estratégicas (spec §5).
13. [x] Pantalla de game over/retry por minijuego (vidas agotadas) y reinicio.
14. [~] Verificación local: servidor activo en http://localhost:8000 — pruebas
        funcionales y de render automáticas aprobadas; falta validación visual.
15. [ ] `git init` local en `IdealPM/` + `.gitignore` (opcional) y primera
        revisión de archivos. (Commits y repo GitHub: los hace el usuario.)
16. [ ] Entrega: instrucciones de despliegue para GitHub Pages (repo público,
        Settings→Pages→main/raíz). URL final: `https://<usuario>.github.io/IdealPM/`.

## Decisiones tomadas
- Contenido de tarjetas en `aciertos.md`: el juego lee el documento del autor con
  `js/aciertos.js` (fetch en el boot). Se divide por minijuego (`##` + emoji) y por
  acierto (`### Cesta/Disparo/Diana`), con dos diálogos por acierto en basketball
  y football y uno en archery (contenido en blockquote `>`). Los aciertos 5-7,
  sin entrada en el doc, usan como respaldo los logros de `config.js`.
- Rutas relativas en todo (fetch/links) para que Pages sirva bajo `/IdealPM/`.
- Audio requiere primer gesto (clic/tecla) por política de autoplay.
- Retry por tiro: se repite el tiro actual hasta acertar o agotar vidas.
- **Desbloqueo secuencial:** solo se juega basketball al inicio; football se
  desbloquea al completar basketball, y archery al completar los dos anteriores.
  Las cards bloqueadas se muestran en gris con candado. Progreso guardado en
  `localStorage` (tecla `R` lo reinicia).
- **Tipografía más legible:** escala global de fuente (`fontScale: 1.32` en
  `config.js`) y más espacio vertical en HUD, tarjetas, menú y podio.
- **Cancha de basketball estilo retro (vista lateral):** cámara de costado como
  los clásicos de baloncesto (tipo NES/Double Dribble): jugador grande a la
  izquierda (sprite ×2.6) lanzando a un aro grande a la derecha (×2.6), cancha
  plana de parquet con marcas pintadas (línea de fondo, círculo central y de
  tiro libre), grada con público y poste con base hasta el suelo.
- **Sistema de sprites (`js/sprites.js`):** sprites pixel-art definidos como SVG
  embebidos (data-URI), rasterizados a baja resolución y ampliados con
  `imageSmoothingEnabled = false` → acabado retro nítido, sin red. Se precargan
  en el boot; si hay URLs en `IPM.CONFIG.spriteURLs` se intentan primero y se
  cae al SVG embebido si fallan. Cada escena dibuja con `spriteOr()` (sprite si
  está listo, fallback procedural si no). Basketball usa sprites de jugador,
  tablero/aro/red y balón; fútbol usa arquero y balón; arquería usa diana y
  flecha. Sombras suaves en el suelo para balones, jugador y arquero.
- **Tarjeta de logro como diálogo:** tras encestar, la animación de vuelo va en
  timeline fijo de 1 s (el balón entra a ~0.72 s) y luego se entra al estado
  `card`: diálogo con avatar del minijuego, texto que **se escribe caracter a
  caracter**, y que **solo desaparece con Click o Espacio** (el primer input
  completa la escritura, el segundo cierra la tarjeta). El contenido sale de
  `aciertos.md` y la tarjeta se asigna al disparar (`shoot()`).
- **Pruebas automáticas en `tests/`:** flujo completo (desbloqueos, fallos,
  gameover, tarjeta asignada en el disparo y cerrada por input), render de todas
  las escenas/estados con y sin sprites (incluye el estado `card`), boot+input,
  rasterización de los 8 sprites y parseo de `aciertos.md`. Ejecutar con
  `node tests/test_*.js`.

## Fuera de alcance (futuras iteraciones)
- Spritesheets y arte manual; efectos de partículas avanzados.
- Leaderboard online (requiere backend).
- Carga dinámica de `Aciertos.md`.
