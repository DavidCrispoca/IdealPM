# 🎮 IdealPM — El perfil del Project Manager Ideal

> Juego web retro *pixel-art* estilo arcade para presentar de forma interactiva
> y lúdica el perfil del **Project Manager ideal**: sus habilidades técnicas y
> blandas, competencias clave, atributos personales, certificaciones y cómo el
> contexto modifica la priorización del perfil.

---

## ✨ ¿Qué es IdealPM?

IdealPM es un juego educativo orientado a **Recursos Humanos, conferencias
corporativas, talleres de liderazgo y gestión de proyectos**. En lugar de una
charla estática, el público juega 3 minijuegos tipo arcade y, con cada acierto,
desbloquea un **diálogo con contenido formativo** sobre el perfil del PM ideal.

Es una aplicación **web estática sin dependencias**: HTML5 Canvas, JavaScript
puro (ES6) y Web Audio API. Funciona en el navegador, se sirve desde cualquier
servidor estático y se publica en GitHub Pages.

## 🕹️ Cómo se juega

1. **Selecciona un minijuego** en el menú principal.
2. **Apunta con el slider de timing:** una aguja oscila en bucle. Dispara
   (ESPACIO / CLICK / TAP) cuando pase por la zona de impacto.
   - 🟢 **Zona verde** → acierto perfecto.
   - 🟡 **Zona amarilla** → acierto ajustado (bueno).
   - 🔴 **Zona roja** → fallo (se gasta 1 de los 7 intentos).
3. **Por minijuego:** 7 intentos; consigue 4 aciertos para completarlo. Cada acierto abre una **tarjeta de
   diálogo** que se escribe carácter a carácter y **solo se cierra con Click o
   Espacio** (el primer input completa la escritura, el segundo avanza al
   siguiente diálogo o cierra la tarjeta).
4. **Desbloqueo secuencial:** empiezas con 🏀 Basketball; al completarlo se
   desbloquea ⚽ Fútbol penaltis; al completar ambos, 🎯 Tiro al blanco. El
   progreso se guarda en `localStorage` (tecla `R` lo reinicia).
5. **Podio final:** con los 12 aciertos (4 por minijuego) se muestra el perfil completo del PM
   ideal y las reflexiones estratégicas (imprescindibles, competencias más
   mencionadas y cómo el contexto prioriza el perfil).

### Los 3 minijuegos
| Minijuego | Escenario | Contenido que desbloquea |
| --- | --- | --- |
| 🏀 **Basketball** | Cancha lateral retro, jugador grande lanzando al aro | Habilidades Técnicas y Blandas (2 diálogos por cesta) |
| ⚽ **Fútbol penaltis** | Portería con arquero, vista desde el pateador | Competencias Clave y Certificaciones Recomendadas (2 diálogos por gol) |
| 🎯 **Tiro al blanco** | Diana frontal, flecha en primer plano | Atributos Personales (1 diálogo por diana) |

## 📚 Contenido dinámico: `aciertos.md`

El contenido de las tarjetas **no vive en el código**: se lee del documento
`aciertos.md` (el documento del autor) en el arranque del juego. Para editar los
diálogos basta con editar ese archivo:

```markdown
## 🏀 PRIMER NIVEL: BASKETBALL

### 🏀 Cesta 1
- **Gestión de riesgos:**
  > *"Identificación, mitigación y planes de contingencia."*
- **Liderazgo situacional e inspiración de equipos:**
  > *"Adaptar el estilo de liderazgo según el contexto y motivar al equipo hacia los objetivos."*
```

Reglas del formato:
- `## <emoji> ...` inicia un minijuego (🏀 → basketball, ⚽ → football, 🎯 → archery).
- `### <emoji> Cesta/Disparo/Diana N` define un acierto (orden = número de tiro).
- Cada viñeta `- **Título:**` es un diálogo; la línea siguiente `> *"descripción."*`
  es su texto. La categoría de la tarjeta se deriva automáticamente según el
  minijuego y el orden del diálogo (basketball: Habilidad Técnica/Blanda; football:
  Competencia Clave/Certificación Recomendada; archery: Atributo Personal).
- Los 4 primeros aciertos salen de `aciertos.md`; los aciertos logrados en los
  intentos 5–7 usan como respaldo los logros de `config.js`.

## 🧰 Tech stack

| Capa | Tecnología |
| --- | --- |
| Lenguaje | JavaScript (ES6), sin frameworks ni dependencias |
| Render | HTML5 Canvas 2D, 800×450 (16:9), pixel-art con `image-rendering: pixelated` |
| Sprites | SVG embebidos (data-URI) rasterizados y ampliados sin suavizado, con fallback procedural |
| Audio | Web Audio API (sintetizado; requiere primer gesto del usuario) |
| Estilos | CSS3, tema retro 8-bit, responsive táctil |
| Persistencia | `localStorage` (clave `idealpm_progress_v1`) |
| Pruebas | Node.js — suites en `tests/` (`node tests/test_*.js`) |
| Despliegue | Servidor estático / GitHub Pages |

## 📁 Estructura del proyecto

```
IdealPM/
├── index.html                # Canvas + carga de scripts
├── README.md                 # Este documento
├── plan.md                   # Plan e hitos de implementación
├── PROJECT_SPECIFICATION.md  # Especificación funcional + estado de implementación
├── DIRECCION_DE_ARTE.md      # Guía de estilo visual y dirección de arte
├── aciertos.md               # Contenido de diálogos por acierto (fuente del juego)
├── css/styles.css
├── js/
│   ├── main.js       # Boot + máquina de estados + input + progreso
│   ├── config.js     # Config global, logros de respaldo y textos del podio
│   ├── aciertos.js   # Parser de aciertos.md + carga dinámica
│   ├── slider.js     # Slider de timing y evaluación del tiro
│   ├── audio.js      # Síntesis de sonido
│   ├── render.js     # Paleta, helpers pixel-art y wrap de texto
│   ├── sprites.js    # Sprites SVG embebidos y precarga
│   └── scenes.js     # Menú, 3 minijuegos, podio, tarjetas de diálogo
└── tests/                    # 5 suites de prueba automáticas
```

## 🚀 Cómo ejecutarlo

Necesitas un servidor local (el `fetch` de `aciertos.md` no funciona abriendo
el archivo directamente).

```bash
# Opción A: Python
python -m http.server 8000

# Opción B: Node
npx serve

# Opción C: cualquier otro servidor estático
```
Abre `http://localhost:8000/`.

## 🧪 Pruebas automáticas

```bash
node tests/test_boot.js       # Boot, input y máquina de estados
node tests/test_flow.js       # Flujo completo (7 intentos, 4 aciertos, tarjetas)
node tests/test_render.js     # Render de todas las escenas/estados (con y sin sprites)
node tests/test_aciertos.js   # Parseo de aciertos.md y cola de diálogos
node tests/test_sprites.js    # Rasterización de sprites
```

## 🌐 Despliegue en GitHub Pages

1. Publica el repo en GitHub.
2. Ve a **Settings → Pages**.
3. Origen: `main` / raíz.
4. El juego quedará en `https://<usuario>.github.io/IdealPM/`.
   (Todo usa rutas relativas, así que funciona bajo subcarpeta.)

## 🎮 Controles

- **ESPACIO / CLICK / TAP:** disparar, avanzar diálogos y navegar el menú.
- **← / → (o tocar a los lados):** cambiar de minijuego en el menú.
- **R:** reiniciar el progreso guardado.

## 🔧 Notas de desarrollo

- **Desbloqueos en prueba:** mientras se validaban los 3 minijuegos, `main.js`
  (`isUnlocked`) quedó con los 3 minijuegos desbloqueados temporalmente. Para
  volver al bloqueo secuencial del jugador, restaurar esa función.
- **Audio:** el navegador exige un primer gesto del usuario para sonar.
- **Fuentes:** todas escaladas por `IPM.CONFIG.fontScale` (1.32) para legibilidad.

## 📄 Documentación relacionada

- `PROJECT_SPECIFICATION.md` — requerimientos funcionales y estado de implementación.
- `DIRECCION_DE_ARTE.md` — estilo visual, paleta y dirección de arte.
- `plan.md` — plan, decisiones de diseño y pendientes.
- `aciertos.md` — contenido editable de los diálogos del juego.
