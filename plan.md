# Plan de implementación — IdealPM (MVP)

## Objetivo
Juego web estático jugable (HTML5 Canvas + JS ES6 + CSS3 + Web Audio API, cero
dependencias) desplegable en GitHub Pages como `https://<usuario>.github.io/IdealPM/`.

## Alcance
- 3 minijuegos: 🏀 Basketball, ⚽ Fútbol (penaltis), 🎯 Tiro al blanco.
- Por minijuego: 7 intentos, 4 aciertos para completar. Slider de timing (zona
  verde/amarilla/roja) cuyas zonas cambian de posición en cada intento.
- Control: ESPACIO / CLICK / TAP. HUD con "INTENTOS X/7" y "Tiro X de 7".
- Tarjetas de diálogo por acierto desbloqueado, con efecto de escritura y
  contenido extraído del documento `aciertos.md` del autor (respaldo en config.js).
- Podio final interactivo (pedestales oro/plata/bronce clicables) con perfil
  completo y las 3 reflexiones estratégicas.
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
       verde/amarilla/roja (que cambian de posición en cada intento), evento de
       tiro (7 intentos; 4 aciertos completan el nivel).
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
12. [x] Escena Podio: podio clásico oro/plata/bronce con pedestales clicables que
         abren tarjetas (perfil completo + 3 reflexiones estratégicas, spec §5).
13. [x] Pantalla de game over/retry por minijuego (7 intentos sin 4 aciertos) y reinicio.
14. [x] Verificación local: servidor activo en http://localhost:8000 — pruebas
        funcionales y de render automáticas aprobadas; validación visual pendiente
        del usuario.
15. [x] `js/aciertos.js`: parser del documento real `aciertos.md` del autor
        (títulos + categoría en la viñeta, descripción en blockquote) y carga
        dinámica en el boot; respaldo a logros de config.js para tiros sin entrada.
16. [x] Tarjeta de logro como diálogo con efecto de escritura que solo se cierra
        con Click/Espacio, y autoajuste de texto/ventana (título 24→19px envuelto
        en máx. 2 líneas; descripción que reduce su fuente de 15→8px hasta caber
        y recorta líneas solo como último recurso).
17. [x] Pruebas automáticas en `tests/` (5 suites, ver abajo).
18. [x] `git init` local + repo remoto `https://github.com/DavidCrispoca/IdealPM.git`
        (rama `main`) creado y sincronizado con `origin/main`.
19. [ ] Despliegue en GitHub Pages (repo público, Settings→Pages→main/raíz).
        URL final: `https://DavidCrispoca.github.io/IdealPM/`.

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
- **Desbloqueo secuencial activo:** solo se juega basketball al inicio; football
  se desbloquea al completar basketball, y archery al completar los dos
  anteriores. Las tarjetas bloqueadas se muestran en gris con candado y tocar
  una muestra el mensaje de bloqueo. Progreso guardado en `localStorage` con la
  clave `idealpm_progress_v2` (tecla `R` lo reinicia). La clave v1 quedó
  invalidada para no arrastrar el progreso de la fase de testing.
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
- **Tarjeta autoajustable:** tarjeta de 560px de ancho; el título usa 24px y baja
  a 19 si envuelve a más de 2 líneas (límite duro de 2); la descripción se
  envuelve al ancho útil (ancho − 128px) y reduce su fuente de 15→8px hasta
  caber en la ventana (máx. 380px), recortando líneas solo como último recurso.
  La ventana crece con el contenido y se ancla arriba para no salirse de la
  pantalla. El pie muestra "TIRO N DE 7". El caret de escritura se escala con el
  tamaño de fuente. `R.wrap` parte las palabras más largas que el ancho máximo.
- **Zonas del slider aleatorias por intento:** las zonas verde y amarilla
  conservan su tamaño (verde 0.16, amarilla 0.15 a cada lado) pero cambian de
  posición en el slider en cada intento (`IPM.CONFIG.slider.randomize: true`,
  centro verde aleatorio entre 0.15 y 0.69). Así la aguja nunca cruza la misma
  zona en el mismo lugar. Los tests fijan `randomize: false` para mantener el
  comportamiento determinista.
- **Podio interactivo (rediseño):** podio clásico de tres escalones — oro alto
  al centro (1. Imprescindibles, ganador), plata a la izquierda (2. Competencias
  mencionadas) y bronce a la derecha (3. Reflexión) — sobre una base con banda
  oscura. Cada pedestal es clicable (hit-test por rectángulo) y abre una tarjeta
  modal con cabecera "PASO N DE 3", título y viñetas; se cierra con toque o
  ESPACIO. ESPACIO sin tocar o un toque fuera del podio devuelve al menú. Pista
  verde de ayuda siempre visible (sin parpadeo). Los textos del podio usan
  `shadow: false` para evitar sombras duplicadas.
- **Página principal (menú):** título animado con wobble, subtítulo
  "¡Conviértete en el Project Manager Ideal!", dos líneas de instrucciones,
  tarjetas de los 3 niveles (bloqueadas en gris con 🔒, completadas con ✓),
  pista parpadeante y barra de teclas "← → SELECCIONAR · ESPACIO JUGAR ·
  R REINICIAR PROGRESO".
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
