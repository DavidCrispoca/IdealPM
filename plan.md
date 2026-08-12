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
- Sin `Aciertos.md`: el contenido ya está en la spec y queda embebido en
  `config.js` (mejora futura: re-introducirlo como `data/` para editarlo sin código).
- Rutas relativas en todo (fetch/links) para que Pages sirva bajo `/IdealPM/`.
- Audio requiere primer gesto (clic/tecla) por política de autoplay.
- Retry por tiro: se repite el tiro actual hasta acertar o agotar vidas.

## Fuera de alcance (futuras iteraciones)
- Spritesheets y arte manual; efectos de partículas avanzados.
- Leaderboard online (requiere backend).
- Carga dinámica de `Aciertos.md`.
