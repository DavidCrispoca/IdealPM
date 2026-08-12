# Plan de implementación — IdealPM (MVP)

## Objetivo
Juego web estático jugable (HTML5 Canvas + JS ES6 + CSS3 + Web Audio API, cero
dependencias) desplegable en GitHub Pages como `https://<usuario>.github.io/IdealPM/`.

## Alcance
- 3 minijuegos: 🏀 Basketball, ⚽ Fútbol (penaltis), 🎯 Tiro al blanco.
- Por minijuego: 7 intentos, 4 aciertos para completar. Slider de timing (zona verde/amarilla/roja).
- Control: ESPACIO / CLICK / TAP. HUD con "INTENTOS X/7" y "Tiro X de 7".
- Tarjetas de diálogo por acierto desbloqueado, con efecto de escritura y
  contenido extraído del documento `aciertos.md` del autor (respaldo en config.js).
- Podio final con perfil completo y las 3 reflexiones estratégicas.
- Pixel-art procedural en Canvas + sprites SVG embebidos (sin spritesheets externos).
- Sonido sintetizado con Web Audio API (requiere primer gesto del usuario).

## Estructura de archivos
```
IdealPM/
├── index.html                # Contenedor canvas + carga de scripts
├── README.md                 # Documentación del proyecto
├── plan.md                   # Este documento
├── PROJECT_SPECIFICATION.md  # Especificación funcional original
├── DIRECCION_DE_ARTE.md      # Guía de estilo visual
├── aciertos.md               # Contenido de diálogos por acierto (fuente del juego)
├── css/styles.css            # Tema retro 8-bit, 16:9, responsive táctil
├── js/
│   ├── main.js       # Boot + máquina de estados (MENÚ→🏀→⚽→🎯→PODIO)
│   ├── config.js     # Config (7 intentos/4 aciertos) + logros de respaldo + podio
│   ├── aciertos.js   # Parser de aciertos.md + carga por fetch
│   ├── slider.js     # Aguja oscilante + zonas + evaluación de tiro
│   ├── audio.js      # Synth Web Audio (acierto/fallo/fanfarria)
│   ├── render.js     # Paleta + helpers pixel-art procedural + wrap de texto
│   ├── sprites.js    # Sprites SVG embebidos rasterizados + precarga
│   └── scenes.js     # Escenas: menú, basketball, fútbol, arquería, podio
└── tests/                    # Suites automáticas (node tests/test_*.js)
```

## Pasos hasta finalizar
1. [x] Crear `plan.md` y estructura de carpetas (css/js).
2. [x] `index.html` + `css/styles.css`: layout 16:9, pixel font, overlay HUD.
3. [x] `js/config.js`: JSON global (gameName, 7 intentos, 4 aciertos) + aciertos de
       los 3 minijuegos + textos del podio (spec §4, §5).
4. [x] `js/audio.js`: sintetizador (beep perfecto, buen tiro, fallo, fanfarria).
5. [x] `js/slider.js`: núcleo de timing — aguja oscilante, zonas
       verde/amarilla/roja, evento de tiro (7 intentos; 4 aciertos completan el nivel).
6. [x] `js/render.js`: utilidades pixel-art (escalado, paleta, rects, textos,
       `wrap` por palabras).
7. [x] `js/main.js`: bucle de juego (requestAnimationFrame), input teclado/
       táctil, máquina de estados y transiciones, progreso en localStorage.
8. [x] Escena Basketball: canasta lateral, animación de enceste/fallo,
       tarjeta con habilidad desbloqueada.
9. [x] Escena Fútbol: portería + arquero, animación gol/atajada, tarjeta.
10. [x] Escena Tiro al blanco: diana frontal, flecha, animación centro/madera,
        tarjeta.
11. [x] HUD unificado: ❤️ x10, "Tiro X de 7" con 🏀/⚽/🎯, contador de aciertos.
12. [x] Escena Podio: perfil completo + 3 reflexiones estratégicas (spec §5).
13. [x] Pantalla de game over/retry por minijuego (7 intentos sin 4 aciertos) y reinicio.
14. [x] Verificación local: servidor activo en http://localhost:8000 — pruebas
        funcionales y de render automáticas aprobadas; validación visual pendiente
        del usuario.
15. [x] `js/aciertos.js`: parser del documento real `aciertos.md` del autor
        (títulos + categoría en la viñeta, descripción en blockquote) y carga
        dinámica en el boot; respaldo a logros de config.js para tiros sin entrada.
16. [x] Tarjeta de logro como diálogo con efecto de escritura que solo se cierra
        con Click/Espacio, y autoajuste de texto/ventana (título envuelto en 2
        líneas, descripción que reduce fuente de 9→6 si excede 4 líneas, ventana
        de 180→320 px).
17. [x] Pruebas automáticas en `tests/` (5 suites, ver abajo).
18. [ ] `git init` local en `IdealPM/` + `.gitignore` (opcional) y primera
        revisión de archivos. (Commits y repo GitHub: los hace el usuario.)
19. [ ] Entrega: instrucciones de despliegue para GitHub Pages (repo público,
        Settings→Pages→main/raíz). URL final: `https://<usuario>.github.io/IdealPM/`.

## Decisiones tomadas
- Contenido de tarjetas en `aciertos.md`: el juego lee el documento del autor con
  `js/aciertos.js` (fetch en el boot). Formato real soportado: sección por
  minijuego (`##` + emoji 🏀/⚽/🎯), acierto por `### Cesta/Disparo/Diana N` y
  diálogos en viñetas `- **Título:**` con descripción en blockquote `> *"..."*`.
  La categoría de la tarjeta se deriva automáticamente según el minijuego y el
  orden del diálogo (basketball → Habilidad Técnica/Blanda, football → Competencia
  Clave/Certificación Recomendada, archery → Atributo Personal). Basketball y
  football tienen 2 diálogos por acierto; archery, 1. Los aciertos sin entrada en
  el doc (tiros 5–7) usan como respaldo los logros de `config.js`.
- Rutas relativas en todo (fetch/links) para que Pages sirva bajo `/IdealPM/`.
- Audio requiere primer gesto (clic/tecla) por política de autoplay.
- 7 intentos por minijuego: cada tiro consume un intento. Con 4 aciertos se
  completa el nivel y se desbloquea el siguiente; si tras los 7 intentos no hay
  4 aciertos, se repite el minijuego.
- **Desbloqueo secuencial:** solo se juega basketball al inicio; football se
  desbloquea al completar basketball, y archery al completar los dos anteriores.
  Las tarjetas bloqueadas se muestran en gris con candado. Progreso guardado en
  `localStorage` (tecla `R` lo reinicia).
  **Nota de desarrollo:** mientras se testeaban los 3 minijuegos se desbloquearon
  temporalmente (en `main.js`, `isUnlocked` devuelve true para los índices 0–2).
  Al terminar el testing, revertir esa función al bloqueo secuencial original.
- **Tipografía más legible:** escala global de fuente (`fontScale: 1.32` en
  `config.js`) y más espacio vertical en HUD, tarjetas, menú y podio.
- **Cancha de basketball estilo retro (vista lateral):** cámara de costado como
  los clásicos de baloncesto: jugador grande a la izquierda (sprite ×2.6)
  lanzando a un aro grande a la derecha (×2.6), cancha plana de parquet con
  marcas pintadas (línea de fondo y círculo central — el círculo de tiro libre se
  eliminó para dejar una sola marca circular), grada con público y poste con base
  hasta el suelo.
- **Sistema de sprites (`js/sprites.js`):** sprites pixel-art definidos como SVG
  embebidos (data-URI), rasterizados a baja resolución y ampliados con
  `imageSmoothingEnabled = false` → acabado retro nítido. Se precargan en el
  boot; si hay URLs en `IPM.CONFIG.spriteURLs` se intentan primero y se cae al
  SVG embebido si fallan. Cada escena dibuja con `spriteOr()` (sprite si está
  listo, fallback procedural si no). Sombras suaves en el suelo para balones,
  jugador y arquero.
- **Tarjeta de logro como diálogo:** tras encestar, la animación de vuelo va en
  timeline fijo de 1 s y luego se entra al estado `card`: diálogo con avatar del
  minijuego, texto que **se escribe carácter a carácter**, y que **solo
  desaparece con Click o Espacio** (el primer input completa la escritura, el
  segundo avanza al siguiente diálogo o cierra la tarjeta). El contenido sale de
  `aciertos.md` y la tarjeta se asigna al disparar (`shoot()`).
- **Tarjeta autoajustable:** el título se envuelve hasta 2 líneas (baja a 19px
  si hace falta) y la descripción se envuelve al ancho de la ventana; si ocupa
  más de 4 líneas la fuente baja de 9→8→7→6px hasta caber. La altura de la
  ventana crece con el contenido (180→320px) y se ancla arriba para no salirse
  de pantalla. El caret de escritura se escala con el tamaño de fuente.
- **Pruebas automáticas en `tests/` (node tests/test_*.js):**
  - `test_boot.js`: boot + input + máquina de estados.
  - `test_flow.js`: flujo completo (4 aciertos completan; 7 intentos sin 4 aciertos -> gameover; tarjeta
    asignada en el disparo y cerrada por input).
  - `test_render.js`: render de todas las escenas/estados con y sin sprites
    (incluye estado `card` con descripciones largas).
  - `test_aciertos.js`: parseo del `aciertos.md` real, cola de diálogos y
    respaldo a config.js.
  - `test_sprites.js`: rasterización de los 8 sprites.

## Fuera de alcance (futuras iteraciones)
- Spritesheets y arte manual en archivos externos; efectos de partículas avanzados.
- Leaderboard online (requiere backend).
- Más de 4 diálogos por minijuego en `aciertos.md` (hoy los tiros 5–7 usan
  respaldo de config.js).
