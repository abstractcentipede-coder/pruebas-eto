#!/data/data/com.termux/files/usr/bin/bash

# ==============================================================================
# SCRIPT DE ARRANQUE PARA TERMUX (ANDROID) - 24/7 HOSTING
# ==============================================================================

# 1. Evitar que Android suspenda el procesador (Wake Lock)
echo "[+] Activando Termux Wake-Lock (evita que el CPU se duerma)..."
termux-wake-lock

# 2. Configuración de puerto
PORT=8080

# 3. Obtener la IP local de la red Wi-Fi
LOCAL_IP=$(ip -4 addr show wlan0 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

echo "============================================================"
echo "    ♣ TERMINAL: LAS 3 PRUEBAS DE ETO // SERVIDOR ACTIVO ♣    "
echo "============================================================"
echo ""
echo "-> Acceso local desde tu teléfono:"
echo "   http://localhost:$PORT"
echo ""
echo "-> Acceso desde otros dispositivos en el mismo Wi-Fi:"
echo "   http://$LOCAL_IP:$PORT"
echo ""
echo "-> Para apagar el servidor: Presiona Ctrl + C"
echo "============================================================"
echo ""

# 4. Iniciar el servidor web HTTP con Python
python -m http.server $PORT
