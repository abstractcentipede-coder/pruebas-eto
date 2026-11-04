# TERMINAL, LAS 3 PRUEBAS DE ETO // 2026

Interfaz web críptica interactiva con estética de terminal retro, animación de tréboles ASCII/8-bit, música en bucle (.mp3), adaptabilidad móvil, animación de TV vieja (CRT Shutdown), ventanas pop-up enlazadas a Google Maps y ventana emergente de NOTA.

---

## 🔒 Protección Anti-Spoilers (DevTools / Inspeccionar Elemento)

La contraseña **no está almacenada en texto plano** en ninguna parte del código fuente. Se valida utilizando un **hash criptográfico unidireccional SHA-256**. Aunque se use la opción de Inspeccionar Elemento o la consola del navegador, la contraseña no puede ser leída ni descubierta.

---

## 📁 Estructura del Proyecto

```text
cryptic-terminal/
│
├── index.html            <- Estructura HTML (sin menciones de la clave)
├── style.css             <- Estilos monocromáticos B/N, animación CRT shutdown, glitch y ventana NOTA
├── script.js             <- Lógica de acceso con SHA-256, gestor de Google Maps y ventanas
├── README.md             <- Instrucciones de uso y personalización
└── assets/               <- Tus imágenes y recursos
    ├── logo.png          <- Logotipo (dentro y al pie del cuadro de contraseña)
    ├── musica.mp3        <- Tu canción/pista de audio en bucle
    ├── popup1.png        <- Imagen para la Terminal 1
    ├── popup2.png        <- Imagen para la Terminal 2
    ├── popup3.png        <- Imagen para la Terminal 3
    ├── popup4.png        <- Imagen para la Terminal 4
    └── fondo.png         <- (Opcional) Tu imagen o GIF de fondo
```

---

## 📍 Configurar el Enlace de Google Maps

Al hacer clic en el contenido o imagen de **cualquiera de las 4 terminales** (`TERMINAL_01` a `TERMINAL_04`), se abrirá la ubicación en Google Maps en una nueva pestaña.

Para cambiar la ubicación de Google Maps:
1. Abre [`script.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/cryptic-terminal/script.js).
2. Busca la línea:
   ```javascript
   googleMapsUrl: "https://maps.app.goo.gl/9v25sD8RVtn19TL89",
   ```
3. Reemplázala por las coordenadas o el enlace de tu preferencia.

---

## 📜 Ventana Emergente de NOTA

Junto al botón de `[ BLOQUEAR SISTEMA ]` se encuentra el botón **`[ NOTA ]`**. Al hacer clic sobre él, se abre una ventana emergente que muestra el mensaje conmemorativo para todos los invitados.

---

## 📺 Secuencia de Desbloqueo y Mensaje Final

Cuando se introduce la contraseña correcta:
1. **Animación de apagado CRT / Fade out:** La interfaz se colapsa hacia una línea luminosa horizontal emulando el apagado de un monitor de tubo/televisión antigua.
2. **Pantalla en negro con texto iluminado:** Aparece un texto en fuente `Courier New` con resplandor catódico y glitch analógico:
   > *"Esta es la ultima pista, gracias por jugar, y les espero para festejar!"*
3. **Acceso al mapa:** Puedes pulsar el botón `[ CONTINUAR AL MAPA Y SUBSISTEMAS ]` (o esperar unos segundos automáticamente) para ingresar al panel con las terminales pop-up.

---

## 🖼️ Posición del Logotipo

El logotipo se ubica **centrado en la parte inferior interna del cuadro de terminal de la contraseña**, con máxima resolución y sin distorsión.
- Para cambiarlo, simplemente reemplaza el archivo [`assets/logo.png`](file:///C:/Users/HP/.gemini/antigravity/scratch/cryptic-terminal/assets/logo.png).

---

## 🎵 Música en Bucle (.mp3)

Guarda tu pista en [`assets/musica.mp3`](file:///C:/Users/HP/.gemini/antigravity/scratch/cryptic-terminal/assets). Comenzará a reproducirse al desbloquear el sistema o al pulsar el botón `[ AUDIO: ON / OFF ]` de la cabecera.
