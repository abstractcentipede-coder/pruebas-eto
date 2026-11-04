#!/data/data/com.termux/files/usr/bin/bash

# ==============================================================================
# SCRIPT DE ENLACE PÚBLICO HTTPS PARA INVITADOS (FUERA DE TU WI-FI)
# ==============================================================================

echo "[+] Generando enlace público HTTPS para que cualquier invitado pueda entrar..."
echo "[+] No requiere abrir puertos ni configurar tu router."
echo ""

# Usando Cloudflare Tunnel gratuito
if ! command -v cloudflared &> /dev/null; then
    echo "[*] Instalando cloudflared en Termux por primera vez..."
    pkg install cloudflared -y
fi

echo "============================================================"
echo "Copia el enlace que termine en .trycloudflare.com y envíalo"
echo "a tus invitados para que jueguen desde cualquier lugar."
echo "============================================================"
echo ""

cloudflared tunnel --url http://localhost:8080
