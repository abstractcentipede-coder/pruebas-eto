/**
 * ==========================================================================
 * TERMINAL // GUI CRÍPTICA EN BLANCO Y NEGRO
 * Lógica principal:
 * 1. Animación ASCII / 8-bit de Tréboles en bucle vertical continuo.
 * 2. Validación de acceso segura mediante HASH SHA-256 (sin exponer la clave en el código).
 * 3. Animación de apagado TV vieja (CRT Shutdown) y texto iluminado con glitch:
 *    "Esta es la ultima pista, gracias por jugar, y les espero para festejar!"
 * 4. 4 Pop-ups interactivos con enlace unificado a Google Maps.
 * 5. Logo centrado en la parte inferior del cuadro de contraseña.
 * 6. Reproductor de música en bucle (.mp3) con controles y soporte móvil.
 * ==========================================================================
 */

// ==========================================
// CONFIGURACIÓN CENTRALIZADA
// ==========================================
const TERMINAL_CONFIG = {
  // Hashes SHA-256 autorizados para proteger la clave de inspecciones en el código
  authHashes: [
    "078798b0069a8d085eb3fba9099aa52487b43265d0445f4411f43f81ea480b31", // Clave oficial
    "36e4e198ebc4d648a8a2026c48a2d1050a853300f9cfb25a565fbdd75c2aa3d0"  // Variante minúscula
  ],
  
  // Mensajes de validación
  errorMessage: "Incorrecto, Trebol fuera de Sitio.",
  successMessage: ">> CLAVE CORRECTA // DESCONEXIÓN DEL SISTEMA...",

  // Mensaje final en la pantalla de TV vieja
  finalMessage: "Esta es la ultima pista, gracias por jugar, y les espero para festejar!",

  // ENLACE A GOOGLE MAPS PARA LAS 4 VENTANAS
  googleMapsUrl: "https://maps.app.goo.gl/9v25sD8RVtn19TL89",

  // Textos de estado
  statusInitial: "CUMPLEAÑOS ACTIVO",
  statusUnlocked: "CUMPLEAÑOS ACTIVO // ACCESO CONCEDIDO",

  // Configuración de Audio / Canción en Loop (.mp3)
  audio: {
    src: "assets/musica.mp3",
    volume: 0.6,
    autoPlayOnUnlock: true
  },

  // Configuración de Fondo
  background: {
    mode: "clovers", // 'clovers' o 'image'
    customImageUrl: "assets/fondo-personalizado.png",
    scrollSpeed: 0.65
  },

  // Imágenes y títulos para las 4 terminales pop-up
  terminals: {
    win1: {
      image: "assets/popup1.png",
      title: "TERMINAL_01"
    },
    win2: {
      image: "assets/popup2.png",
      title: "TERMINAL_02"
    },
    win3: {
      image: "assets/popup3.png",
      title: "TERMINAL_03"
    },
    win4: {
      image: "assets/popup4.png",
      title: "TERMINAL_04"
    }
  }
};


// ==========================================
// FUNCIÓN CRIPTOGRÁFICA DE HASH SHA-256
// ==========================================
async function computeHash(text) {
  if (window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (e) {
      // Continuar con fallback si falla
    }
  }
  return fallbackSha256(text);
}

// Algoritmo SHA-256 integrado en puro JS como respaldo
function fallbackSha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = "length";
  let i, j;
  let result = "";
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0)) | 0;
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;
      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? "0" : "") + byte.toString(16);
    }
  }
  return result;
}


// ==========================================
// 1. CONFIGURACIÓN DE ENLACES A GOOGLE MAPS
// ==========================================
function updateGoogleMapsLinks() {
  const mapLinks = document.querySelectorAll(".map-target-link");
  mapLinks.forEach(link => {
    link.href = TERMINAL_CONFIG.googleMapsUrl;
  });
}
document.addEventListener("DOMContentLoaded", updateGoogleMapsLinks);


// ==========================================
// 2. GESTOR DE AUDIO / MÚSICA EN BUCLE (.MP3)
// ==========================================
const bgMusic = document.getElementById("bg-music");
const audioToggleBtn = document.getElementById("audio-toggle-btn");
const audioStatus = document.getElementById("audio-status");
let isMusicPlaying = false;

if (bgMusic) {
  bgMusic.volume = TERMINAL_CONFIG.audio.volume;
}

function playMusic() {
  if (!bgMusic) return;
  bgMusic.play().then(() => {
    isMusicPlaying = true;
    if (audioStatus) audioStatus.textContent = "ON";
    if (audioToggleBtn) audioToggleBtn.classList.add("playing");
  }).catch(() => {
    console.log("Audio esperando interacción del usuario.");
  });
}

function pauseMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  isMusicPlaying = false;
  if (audioStatus) audioStatus.textContent = "OFF";
  if (audioToggleBtn) audioToggleBtn.classList.remove("playing");
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

if (audioToggleBtn) {
  audioToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

function tryAudioOnFirstInteraction() {
  if (!isMusicPlaying && TERMINAL_CONFIG.audio.autoPlayOnUnlock) {
    playMusic();
  }
  window.removeEventListener("click", tryAudioOnFirstInteraction);
  window.removeEventListener("touchstart", tryAudioOnFirstInteraction);
}
window.addEventListener("click", tryAudioOnFirstInteraction, { once: true });
window.addEventListener("touchstart", tryAudioOnFirstInteraction, { once: true });


// ==========================================
// 3. ANIMACIÓN 8-BIT / ASCII DE TRÉBOLES (LOOP VERTICAL)
// ==========================================
const canvas = document.getElementById("clover-canvas");
const ctx = canvas.getContext("2d");

let canvasWidth, canvasHeight;
let cloverGrid = [];
const FONT_SIZE = 16;
let scrollOffsetY = 0;

const CLOVER_CHARS = ["♣", "♣", "♣", "[♣]", "::♣::", "☘", ".♣.", " ♣ "];
const NOISE_CHARS = [".", ":", ";", "0", "1", "x", "#", "+", " "];

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  initCloverPattern();
}

function initCloverPattern() {
  cloverGrid = [];
  const colSpacing = window.innerWidth <= 768 ? FONT_SIZE * 2.2 : FONT_SIZE * 1.8;
  const cols = Math.ceil(canvasWidth / colSpacing);
  const rows = Math.ceil(canvasHeight / (FONT_SIZE * 1.5)) + 4;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const isClover = Math.random() < 0.35;
      const char = isClover 
        ? CLOVER_CHARS[Math.floor(Math.random() * CLOVER_CHARS.length)]
        : (Math.random() < 0.25 ? NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)] : " ");
      
      const opacity = isClover ? (0.35 + Math.random() * 0.55) : 0.12;
      row.push({ char, opacity });
    }
    cloverGrid.push(row);
  }
}

function renderCloverAnimation() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;
  ctx.textAlign = "center";
  
  const rowHeight = FONT_SIZE * 1.6;
  const colWidth = window.innerWidth <= 768 ? FONT_SIZE * 2.2 : FONT_SIZE * 1.8;
  const totalPatternHeight = cloverGrid.length * rowHeight;

  scrollOffsetY = (scrollOffsetY + TERMINAL_CONFIG.background.scrollSpeed) % rowHeight;

  for (let r = 0; r < cloverGrid.length; r++) {
    for (let c = 0; c < cloverGrid[r].length; c++) {
      const item = cloverGrid[r][c];
      if (item.char.trim() === "") continue;

      const x = c * colWidth + (colWidth / 2);
      let y = (r * rowHeight + scrollOffsetY) % totalPatternHeight;

      ctx.fillStyle = `rgba(255, 255, 255, ${item.opacity})`;
      ctx.fillText(item.char, x, y);
    }
  }

  requestAnimationFrame(renderCloverAnimation);
}


// ==========================================
// 4. SISTEMA DE ACCESO, SHUTDOWN Y MENSAJE DE TV
// ==========================================
const accessForm = document.getElementById("access-form");
const passwordInput = document.getElementById("password-input");
const feedbackMessage = document.getElementById("feedback-message");
const unlockedDashboard = document.getElementById("unlocked-dashboard");
const statusText = document.getElementById("status-text");
const togglePwdBtn = document.getElementById("toggle-pwd-btn");
const mainWorkspace = document.getElementById("main-workspace");
const tvMessageScreen = document.getElementById("tv-message-screen");
const tvContinueBtn = document.getElementById("tv-continue-btn");

if (statusText) {
  statusText.textContent = TERMINAL_CONFIG.statusInitial;
}

// Toggle ver u ocultar contraseña
if (togglePwdBtn) {
  togglePwdBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePwdBtn.textContent = "[ OCULTAR CARACTERES ]";
    } else {
      passwordInput.type = "password";
      togglePwdBtn.textContent = "[ MOSTRAR CARACTERES ]";
    }
  });
}

function playRetroTone(freq, duration, type = "square") {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Autoplay fallback
  }
}

// Procesar formulario con hash criptográfico SHA-256
if (accessForm) {
  accessForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const entered = passwordInput.value.trim();
    const hash = await computeHash(entered);

    if (TERMINAL_CONFIG.authHashes.includes(hash)) {
      handleAccessSuccess();
    } else {
      handleAccessDenied();
    }
  });
}

let autoTransitionTimer = null;

function handleAccessSuccess() {
  playRetroTone(880, 0.25);
  setTimeout(() => playRetroTone(1320, 0.35), 180);

  // Iniciar música de fondo
  if (TERMINAL_CONFIG.audio.autoPlayOnUnlock && !isMusicPlaying) {
    playMusic();
  }

  feedbackMessage.className = "feedback-message success";
  feedbackMessage.textContent = TERMINAL_CONFIG.successMessage;
  passwordInput.disabled = true;
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.disabled = true;

  // 1. INICIAR EFECTO DE APAGADO DE TV (CRT Shutdown)
  setTimeout(() => {
    if (mainWorkspace) {
      mainWorkspace.classList.add("crt-powering-down");
    }
  }, 400);

  // 2. MOSTRAR PANTALLA EN NEGRO CON TEXTO ILUMINADO / GLITCH
  setTimeout(() => {
    if (tvMessageScreen) {
      tvMessageScreen.classList.remove("hidden");
    }

    autoTransitionTimer = setTimeout(() => {
      finishTransitionToUnlocked();
    }, 7000);
  }, 1050);
}

// Botón de continuar desde la pantalla de TV
if (tvContinueBtn) {
  tvContinueBtn.addEventListener("click", () => {
    if (autoTransitionTimer) clearTimeout(autoTransitionTimer);
    finishTransitionToUnlocked();
  });
}

// Transición final al entorno desbloqueado
function finishTransitionToUnlocked() {
  if (tvMessageScreen) {
    tvMessageScreen.classList.add("hidden");
  }

  if (mainWorkspace) {
    mainWorkspace.classList.remove("crt-powering-down");
  }

  document.body.classList.remove("locked");
  document.body.classList.add("unlocked");

  if (statusText) {
    statusText.textContent = TERMINAL_CONFIG.statusUnlocked;
  }

  if (unlockedDashboard) {
    unlockedDashboard.classList.remove("hidden");
  }

  openAllWindows();

  if (window.innerWidth <= 768 && unlockedDashboard) {
    unlockedDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function handleAccessDenied() {
  playRetroTone(160, 0.25, "sawtooth");
  
  feedbackMessage.className = "feedback-message error";
  feedbackMessage.textContent = TERMINAL_CONFIG.errorMessage;

  passwordInput.value = "";
  passwordInput.focus();

  setTimeout(() => {
    feedbackMessage.classList.remove("error");
    feedbackMessage.style.backgroundColor = "#fff";
    feedbackMessage.style.color = "#000";
    feedbackMessage.textContent = TERMINAL_CONFIG.errorMessage;
  }, 400);
}

function lockSystem() {
  document.body.classList.remove("unlocked");
  document.body.classList.add("locked");
  if (unlockedDashboard) unlockedDashboard.classList.add("hidden");
  closeAllWindows();
  
  passwordInput.disabled = false;
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.disabled = false;
  
  passwordInput.value = "";
  feedbackMessage.textContent = "";
  feedbackMessage.className = "feedback-message";
  
  if (statusText) {
    statusText.textContent = TERMINAL_CONFIG.statusInitial;
  }
  
  passwordInput.focus();
}


// ==========================================
// 5. GESTIÓN DE LAS VENTANAS POPUP
// ==========================================
const windowIds = ["win-1", "win-2", "win-3", "win-4", "win-note"];
let topZIndex = 100;

function toggleWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.classList.contains("hidden")) {
    win.classList.remove("hidden");
    bringToFront(win);
    playRetroTone(440, 0.08);
  } else {
    win.classList.add("hidden");
    playRetroTone(220, 0.08);
  }
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) {
    win.classList.add("hidden");
    playRetroTone(220, 0.08);
  }
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (win) {
    win.classList.toggle("minimized");
    playRetroTone(330, 0.06);
  }
}

function openAllWindows() {
  ["win-1", "win-2", "win-3", "win-4"].forEach((id, index) => {
    const win = document.getElementById(id);
    if (win) {
      setTimeout(() => {
        win.classList.remove("hidden");
        win.classList.remove("minimized");
        bringToFront(win);
        playRetroTone(320 + index * 100, 0.07);
      }, index * 100);
    }
  });
}

function closeAllWindows() {
  windowIds.forEach(id => {
    const win = document.getElementById(id);
    if (win) win.classList.add("hidden");
  });
}

function bringToFront(win) {
  if (window.innerWidth <= 768) return;
  topZIndex += 2;
  document.querySelectorAll(".cryptic-window").forEach(w => w.classList.remove("active-window"));
  win.classList.add("active-window");
  win.style.zIndex = topZIndex;
}


// ==========================================
// 6. SISTEMA DE ARRASTRE (DRAGGABLE EN PC)
// ==========================================
function makeDraggable(win) {
  const header = win.querySelector(".window-header");
  let isDragging = false;
  let startX, startY, initialX, initialY;

  win.addEventListener("mousedown", () => bringToFront(win));

  header.addEventListener("mousedown", (e) => {
    if (window.innerWidth <= 768 || e.target.classList.contains("win-btn")) return;
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = win.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    win.style.position = "fixed";
    win.style.left = `${Math.max(10, Math.min(window.innerWidth - win.offsetWidth - 10, initialX + dx))}px`;
    win.style.top = `${Math.max(10, Math.min(window.innerHeight - 50, initialY + dy))}px`;
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

windowIds.forEach(id => {
  const win = document.getElementById(id);
  if (win) makeDraggable(win);
});


// ==========================================
// 7. PLACEHOLDER PARA IMÁGENES NO ENCONTRADAS
// ==========================================
function showPlaceholder(imgElement, text) {
  const parent = imgElement.parentElement;
  imgElement.style.display = "none";
  
  const box = document.createElement("div");
  box.className = "placeholder-box";
  box.innerHTML = `
    <div class="placeholder-clover">♣</div>
    <div>${text}</div>
  `;
  parent.appendChild(box);
}


// ==========================================
// 8. RELOJ UTC CRÍPTICO
// ==========================================
function updateClock() {
  const now = new Date();
  const utcString = now.toUTCString().split(" ")[4] || now.toTimeString().split(" ")[0];
  const clockEl = document.getElementById("clock-display");
  if (clockEl) {
    clockEl.textContent = `${utcString} UTC // SYS_ONLINE`;
  }
}
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 9. INICIALIZACIÓN GENERAL
// ==========================================
window.addEventListener("resize", () => {
  resizeCanvas();
  if (window.innerWidth <= 768) {
    windowIds.forEach(id => {
      const win = document.getElementById(id);
      if (win) {
        win.style.position = "";
        win.style.left = "";
        win.style.top = "";
      }
    });
  }
});

// Comprobar fondo personalizado
if (TERMINAL_CONFIG.background.mode === "image") {
  const bgLayer = document.getElementById("custom-bg");
  if (bgLayer) {
    bgLayer.classList.remove("hidden");
    bgLayer.style.backgroundImage = `url('${TERMINAL_CONFIG.background.customImageUrl}')`;
  }
  canvas.style.display = "none";
}

// Iniciar bucle de tréboles y actualizar enlaces de Google Maps
resizeCanvas();
renderCloverAnimation();
updateGoogleMapsLinks();
