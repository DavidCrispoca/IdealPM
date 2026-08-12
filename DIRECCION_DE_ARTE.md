# 🎨 GUÍA DE ESTILO VISUAL Y DISEÑO DE ARTE: "IdealPM"
> **Documento de Dirección de Arte, Estética Pixel Art Moderna y Paleta de Colores**  
> *Destinado a desarrollo con Opencode / AI Code Generator (Versión 3.0)*

---

## 1. CONCEPTO VISUAL Y FILOSOFÍA DE DISEÑO

- **Línea Estética:** **Modern High-Density Retro Pixel Art** (Estilo *Stardew Valley*, *Stranger Things: The Game*, *Eastward*, *Terraria*).
- **Sensación General:** Viva, clara, profesional, acogedora y estimulante. El juego debe transmitir **alegría, espacio y curiosidad**, evitando la apariencia "barata", plana o excesivamente primitiva de los juegos de 8-bit de 1980 (estilo *Atari* o *NES* básico con bloques gigantes).
- **Público Objetivo:** Audiencias de Recursos Humanos y conferencias corporativas. Debe verse refinado, pulido y visualmente cautivador desde el primer segundo en pantalla.

---

## 2. DENSIDAD DE PÍXELES Y TÉCNICA DE RENDERIZADO (HIGH-DENSITY PIXEL ART)

### **a. Resolución Interna y Relación de Aspecto**
- **Resolución Virtual del Canvas:** **480 × 270 píxeles** (Relación nativa 16:9).
  - *¿Por qué esta resolución?* Al escalarse en pantallas Full HD (1920×1080) o 4K mediante escalado entero por hardware (Factor 4x o 8x), mantiene píxeles perfectamente nítidos pero lo suficientemente pequeños para dibujar expresiones, sombras sutiles, curvaturas suaves y detalles minuciosos.
- **Renderizado CSS:**
  ```css
  canvas {
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    width: 100%;
    max-width: 1280px;
    height: auto;
    aspect-ratio: 16 / 9;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
  }
  ```

### **b. Anatomía Visual de Sprites (Diferencia clave con el retro antiguo)**
- **Tamaño de Sprites:**
  - Personajes / Avatares: **32×32 píxeles** o **32×48 píxeles** (permite proporciones estilizadas con ojos expresivos, postura natural y vestimenta detallada).
  - Objetos / Balones / Flechas: **16×16** a **24×24 píxeles**.
  - Escenarios / Fondos: Divididos en cuadrículas de **16×16 píxeles** (Tilesets).
- **Técnicas Visuales Obligatorias:**
  - **Outlines Suaves (Dark Color Outlines):** No usar líneas negras puras (`#000000`) para los contornos. Usar versiones oscuras del color del objeto (ej. café oscuro para la madera, azul marino para uniforme azul).
  - **Sombras Proyectadas (Drop Shadows):** Sombras ovaladas semi-transparentes (`rgba(0, 0, 0, 0.25)`) debajo de personajes, balones y dianas para crear sensación de profundidad y suelo real.
  - **Highlights / Brillos:** Puntos de luz cálidos en bordes superiores para simular iluminación solar ambiental.

---

## 3. PALETA DE COLORES (VIBRANTE, CÁLIDA Y LUMINOSA)

La paleta se basa en tonos **cálidos, saturados y alegres** inspirados en el ambiente estival y acogedor de *Stardew Valley*:

### **a. Colores Base del Entorno y Iluminación**
- **Verde Césped / Campo (Cálido y Fresco):** `#5CB85C` (Luz), `#3E8E41` (Base), `#2A5A29` (Sombra).
- **Tierra / Cancha de Madera (Cálido):** `#E8A87C` (Madera clara), `#C38D9E` (Acento), `#8D5B4C` (Sombra madera/tierra).
- **Cielo y Espacialidad (Luminoso):** `#87CEEB` (Cielo despejado), `#E0F7FA` (Cielo mañana), `#FFF9E6` (Luz solar cálida).
- **Blanco Neón / Marcadores:** `#FFFFFF` para bordes e indicadores con contraste.

### **b. Colores de Energía y Feedback de Juego**
- **Verde Acierto (Zona Perfecta Slider):** `#2ECC71` (Verde esmeralda brillante).
- **Amarillo Advertencia / Zona Buena:** `#F1C40F` (Amarillo oro cálido).
- **Rojo Intenso / Zona Fallo:** `#E74C3C` (Coral rojo vibrante).
- **UI / Dorado Retro (Marcos y Podio):** `#FFD700` (Oro), `#FFA500` (Naranja ámbar).

---

## 4. DIRECCIÓN DE ARTE PARA LOS 3 MINIJUEGOS Y PODIO

### **🏀 Minijuego 1: Basketball (Cancha de Madera o Exterior)**
- **Fondo:** Cancha retro de madera cálida pulida con marcadores blancos nítidos y gradiente de luz ambiental. Red de canasta con física ligera y movimiento de red al encestar.
- **Cámara (implementada):** vista **lateral** estilo baloncesto retro de 16-bit: jugador grande (sprite ×2.6) a la izquierda lanzando a un aro grande (×2.6) a la derecha, sobre una cancha plana de parquet con marcas pintadas (línea de fondo, círculo central y de tiro libre) y grada con público. El balón vuela en arco con sombra proyectada que se mueve por el suelo.
- **Efectos Visuales de Acierto:**
  - Chispas retro / destellos dorados (`#FFD700`) al pasar el balón limpiamente.
  - Texto flotante pixel art *"¡PERFECTO!"* o *"¡ACIERTO!"* con animación hacia arriba.

### **⚽ Minijuego 2: Fútbol Penaltis (Campo al Aire Libre)**
- **Fondo:** Césped verde brillante tipo *Stardew Valley* con textura de hierba pixelada sutil, sombras de árboles en los bordes para dar espacialidad y red de arquería blanca bien definida.
- **Efectos Visuales de Acierto:**
  - Movimiento de red (efecto de estiramiento pixel art).
  - Celebración del personaje con animación de brazos arriba (3 frames de sprite).

### **🎯 Minijuego 3: Tiro al Blanco (Campo de Arquería Rural)**
- **Fondo:** Paisaje campestre cálido, dianas de madera clásica con anillos de colores vivos (Rojo, Azul, Amarillo, Blanco).
- **Efectos Visuales de Acierto:**
  - Zoom suave o efecto de cámara para enfatizar el impacto en el centro de la diana.
  - Partículas de polvo de madera / brillos alrededor de la flecha clavada.

### **🏆 Podio Final y Dashboard Ejecutivo**
- **Diseño:** Escenario con podio de 3 escalones de madera y oro, confeti pixel art cayendo en bucle, estandartes coloridos y el avatar con sus trofeos ganados.
- **Tarjetas de Reflexión:** Cajas con textura de papiro o madera clara con bordes dorados, tipografía nítida y contraste óptimo para lectura durante ponencias de Recursos Humanos.

---

## 5. RECURSOS VISUALES Y RECOMENDACIÓN DE ASSETS PARA OPENCODE

Para evitar rectángulos genéricos, Opencode debe utilizar alguno de estos enfoques estéticos de alta calidad:

1. **Sprites de OpenGameArt / Kenney.nl (Licencia CC0 / Libre uso):**
   - *Kenney Tiny Town / Sports Pack:* Assets de 16×16 y 32×32 píxeles profesionales con estética pixel art moderna.
   - *CraftPix Free Pixel Art UI & Characters:* Avatares estilizados con animaciones de idle y tiro.
2. **Dibujo por Código SVG/Canvas Avanzado (Pixel-Art Procedural con Sombras):**
   - En lugar de `ctx.fillRect(x, y, w, h)` básico, dibujar estructuras compuestas por módulos de 2×2 píxeles con iluminación de dos tonos (color base + color de sombra en la esquina inferior derecha + brillo en la esquina superior izquierda).

---

## 6. INSTRUCCIONES DIRECTAS PARA OPENCODE

```text
Aplica la nueva Dirección de Arte para "IdealPM":

1. Modifica la resolución lógica del Canvas a 480x270 píxeles para lograr un pixel art de alta densidad (estilo Stardew Valley).
2. Usa la paleta de colores cálida y vibrante especificada (césped #5CB85C, maderas #E8A87C, tonos dorados #FFD700 y cielos #87CEEB).
3. Agrega sombras proyectadas (drop shadows) ovaladas debajo de todos los elementos interactivos para dar sensación de profundidad y espacio 3D retro.
4. Implementa animaciones de partículas simples (estrellas/brillos de 2x2 píxeles) al lograr cada acierto.
5. Asegúrate de que las fuentes de texto mantengan proporciones nítidas y legibles sin verse borrosas.
```
