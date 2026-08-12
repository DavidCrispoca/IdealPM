# 🎮 ESPECIFICACIÓN DEL PROYECTO: "IdealPM"
> **Documento de Requerimientos Técnicos y Funcionales para Implementación Web**  
> *Destinado a desarrollo con Opencode / AI Code Generator (Versión 2.0)*

---

## 1. RESUMEN DEL PROYECTO

- **Nombre Oficial del Juego:** `IdealPM`
- **Plataforma:** Aplicación Web (HTML5, CSS3, JavaScript / Phaser 3 o HTML5 Canvas vanilla).
- **Estilo Visual:** Retro 8-Bit / 16-Bit Pixel Art estilo *Stardew Valley* / NES Arcade.
- **Público Objetivo:** Departamento de Recursos Humanos, conferencias corporativas, talleres de liderazgo y gestión de proyectos.
- **Propósito:** Presentar interactiva y lúdicamente el perfil del Project Manager Ideal, sus habilidades, competencias, certificaciones y el impacto del contexto en la priorización del perfil.
- **Dificultad y Experiencia:** Altamente intuitivo, ágil y visual para uso dinámico durante ponencias o actividades presenciales/remotas.

---

## 2. CÁMARA, PERSPECTIVA Y SISTEMA DE VIDAS/TIROS

### **Perspectiva Visual y Cámara**
El juego utilizará una perspectiva retro optimizada según el deporte para garantizar claridad inmediata en el feedback de acierto o fallo:
- **Cámara Frontal en 1ª Persona (o Perspectiva Trapera):** Apuntando directamente hacia el objetivo (ej. la diana en tiro al blanco o la portería/canasta).
- **Cámara Lateral / Ángulo de Media Cancha:** Estilo tiro libre de fútbol retro o tiro en suspensión de baloncesto de 16-bit, donde el ángulo permite ver claramente la trayectoria del balón/flecha y la animación clara de **GOL / ENCESTADO / DIANA** o **FALLADO / FUERA**.

### **Sistema de Vidas y Tiros por Minijuego**
- **Vidas Iniciales por Minijuego:** 10 Vidas (Corazones / Indicador retro).
- **Número de Tiros / Intentos por Minijuego:** 7 Tiros en total para completar y superar el nivel.
- **Mecánica de Fallo:** Si el jugador falla un tiro (agujas en zona roja del slider), pierde 1 vida, pero puede reintentar ese tiro actual hasta consumir las vidas o acertar los 7 tiros requeridos.
- **Integración con `Aciertos.md`:** Los 7 tiros victoriosos de cada minijuego están mapeados directamente a la lista de aciertos/desbloqueos definida en el archivo externo `Aciertos.md`. Cada tiro acertado despliega la tarjeta/pop-up retro correspondiente con la habilidad, competencia o certificación lograda.

---

## 3. MECÁNICA PRINCIPAL (SLIDER DE TIEMPO / TIMING METER)

1. Un **Slider Horizontal / Vertical Retro** con una aguja o indicador que oscila en bucle continuo a velocidad constante.
2. **Zonas de Impacto:**
   - **Zona Verde (Perfect / Center):** Acierto limpio + Desbloqueo directo del ítem de `Aciertos.md`.
   - **Zona Amarilla (Good):** Acierto ajustado + Desbloqueo del ítem.
   - **Zona Roja (Miss / Fail):** Tiro fallido (Animación de fallo, -1 Vida).
3. **Control Unificado:** Un solo botón / toque en pantalla (Tecla `ESPACIO` o `CLICK / TAP`).

---

## 4. ESTRUCTURA DE MINIJUEGOS Y MAPPING DE ACIERTOS (`Aciertos.md`)

```
[ PANTALLA INICIAL: IdealPM ]
            │
            ▼
[ MINIJUEGO 1: BASKETBALL ] ──► (10 Vidas | 7 Tiros) ──► Habilidades Técnicas y Blandas
            │
            ▼
[ MINIJUEGO 2: FÚTBOL ]      ──► (10 Vidas | 7 Tiros) ──► Competencias Claves y Atributos
            │
            ▼
[ MINIJUEGO 3: TIRO AL BLANCO ] ──► (10 Vidas | 7 Tiros) ──► Certificaciones
            │
            ▼
[ PODIO FINAL & DASHBOARD ]  ──► (Perfil Completo + Reflexión Estratégica)
```

---

### **MINIJUEGO 1: BASKETBALL (10 Vidas | 7 Tiros)**
- **Perspectiva:** Cámara en 1ª persona desde la línea de tiros libres o lateral de media cancha estilo arcade.
- **Mapeo de los 7 Tiros Acertados (Extraído de `Aciertos.md` / Matriz PM):**
  1. *Tiro 1:* Gestión de Riesgos (Técnica).
  2. *Tiro 2:* Planificación y Estimación de Cronogramas/Presupuestos (Técnica).
  3. *Tiro 3:* Manejo de Metodologías Ágiles y Predictivas (Técnica).
  4. *Tiro 4:* Dominio de Herramientas de Gestión (Técnica).
  5. *Tiro 5:* Liderazgo Situacional e Inspiración de Equipos (Blanda).
  6. *Tiro 6:* Comunicación Asertiva Técnica y Gerencial (Blanda).
  7. *Tiro 7:* Empatía, Inteligencia Emocional y Pensamiento Crítico (Blanda).

---

### **MINIJUEGO 2: FÚTBOL - PENALTIS (10 Vidas | 7 Tiros)**
- **Perspectiva:** Cámara trasera detrás del pateador / cámara lateral de tiro libre que muestra la portería y la trayectoria hacia las esquinas o el centro.
- **Mapeo de los 7 Tiros Acertados (Extraído de `Aciertos.md` / Matriz PM):**
  1. *Tiro 1:* Optimización y Gestión del Tiempo (Competencia).
  2. *Tiro 2:* Negociación de Expectativas con Stakeholders (Competencia).
  3. *Tiro 3:* Toma de Decisiones Estratégicas bajo Presión (Competencia).
  4. *Tiro 4:* Análisis de Datos e Indicadores KPIs (Competencia).
  5. *Tiro 5:* Adaptabilidad y Flexibilidad ante Cambios (Atributo).
  6. *Tiro 6:* Proactividad y Mentalidad Orientada a Soluciones (Atributo).
  7. *Tiro 7:* Resiliencia, Integridad y Accountability (Atributo).

---

### **MINIJUEGO 3: TIRO AL BLANCO - ARQUERÍA (10 Vidas | 7 Tiros)**
- **Perspectiva:** Cámara frontal en 1ª persona alineada con la diana/blanco y la flecha en primer plano.
- **Mapeo de los 7 Tiros Acertados (Extraído de `Aciertos.md` / Matriz PM):**
  1. *Tiro 1:* Certificación PMP® (Project Management Professional - PMI).
  2. *Tiro 2:* Certificación CSM® / PSM I (Certified Scrum Master).
  3. *Tiro 3:* Certificación CAPM® (Certified Associate in PM).
  4. *Tiro 4:* Certificación PMI-ACP® (Agile Certified Practitioner).
  5. *Tiro 5:* Certificaciones PM2 (Essentials & Advanced).
  6. *Tiro 6:* Certificación IPMA (Level C-D).
  7. *Tiro 7:* Máxima Acreditación Integral en Gestión de Proyectos.

---

## 5. SECCIÓN FINAL: PODIO Y REFLEXIÓN ESTRATÉGICA

Al agotar con éxito los 7 tiros de los 3 minijuegos, se accede al Podio Final donde se estructuran los 3 puntos de reflexión requeridos para la charla de Recursos Humanos:

### **1. Características Imprescindibles y Justificación**
- **Comunicación Asertiva:** Puente indispensable entre desarrolladores, clientes y directivos. Si falla la comunicación, el proyecto fracasa sin importar la tecnología utilizada [cite: 1].
- **Gestión de Riesgos y Planificación:** Anticipar problemas ahorra presupuesto y tiempo, asegurando entregables de alta calidad [cite: 1].
- **Adaptabilidad:** La rigidez destruye la dinámica de trabajo y retrasa el producto final en entornos cambiantes [cite: 1].

### **2. Competencias Más Mencionadas en la Industria**
- **Liderazgo y Comunicación:** El motor diario del PM para guiar y mover al equipo [cite: 1].
- **Manejo del Tiempo y Organización:** Vital para garantizar el cumplimiento de deadlines [cite: 1].
- **Gestión de Riesgos:** La habilidad técnica más valorada para proteger la rentabilidad y el alcance [cite: 1].

### **3. Reflexión: Cómo modifica el contexto la prioridad del perfil**
- **Por Industria:**
  - *Software / Tecnología / Interactivos:* PM enfocado en Agilidad (Scrum), iteraciones rápidas y buena comprensión técnica [cite: 1].
  - *Construcción / Ingeniería Tradicional:* PM enfocado en control riguroso de costos, gestión predictiva (Waterfall), contratos y normativas [cite: 1].
- **Por Tamaño de Empresa:**
  - *Startups / Equipos Pequeños:* PM "todoterreno", con alta proactividad, versatilidad e involucramiento directo en tareas operativas o UI/UX [cite: 1].
  - *Corporaciones / Grandes Empresas:* Prioridad en diplomacia, gestión formal de stakeholders, cumplimiento estricto de procesos y certificaciones avanzadas PMP [cite: 1].

---

## 6. ARCHIVO CONFIGURABLE JSON (INCLUYENDO VIDAS Y TIROS)

```json
{
  "gameName": "IdealPM",
  "globalRules": {
    "livesPerMinigame": 10,
    "shotsToPass": 7,
    "externalContentFile": "Aciertos.md"
  },
  "cameraModes": {
    "basketball": "frontal_or_side_half_court",
    "football": "behind_kicker_or_side_penalty",
    "archery": "first_person_target"
  },
  "minigames": [
    {
      "id": "basketball",
      "name": "Basketball IdealPM",
      "shots": 7,
      "lives": 10
    },
    {
      "id": "football",
      "name": "Fútbol Penaltis IdealPM",
      "shots": 7,
      "lives": 10
    },
    {
      "id": "archery",
      "name": "Tiro al Blanco IdealPM",
      "shots": 7,
      "lives": 10
    }
  ]
}
```

---

## 7. INDICACIONES PARA OPENCODE

1. Implementar la interfaz para cargar opcionalmente las descripciones desde un archivo `Aciertos.md` parseado dinámicamente o usar el objeto JSON de fallback.
2. Renderizar un HUD superior persistente con:
   - Contador de Vidas (`❤️ x 10`).
   - Contador de Progreso (`🏀 / ⚽ / 🎯 Tiro X de 7`).
3. Diseñar las animaciones de feedback inmediato de tiro (Balón entrando por la canasta / Pelota rompiendo la red / Flecha dando en el centro) frente a tiros fallidos (Balón pegando en el aro / Atajada del arquero / Flecha clavada en la madera).
