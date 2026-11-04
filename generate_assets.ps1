Add-Type -AssemblyName System.Drawing

function Create-CrypticImage {
    param(
        [string]$filePath, 
        [string]$titleText, 
        [string]$iconSymbol
    )
    
    $width = 400
    $height = 250
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Fondo negro profundo
    $g.Clear([System.Drawing.Color]::Black)
    
    # Bordes monocromáticos estilo terminal
    $penWhite = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 2)
    $penGray = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 100, 100), 1)
    $penGray.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    
    $g.DrawRectangle($penWhite, 8, 8, $width - 16, $height - 16)
    $g.DrawRectangle($penGray, 18, 18, $width - 36, $height - 36)
    
    # Fuentes retro Courier New
    $fontIcon = New-Object System.Drawing.Font('Courier New', 32, [System.Drawing.FontStyle]::Bold)
    $fontTitle = New-Object System.Drawing.Font('Courier New', 13, [System.Drawing.FontStyle]::Bold)
    $fontSub = New-Object System.Drawing.Font('Courier New', 9)
    
    $brushWhite = [System.Drawing.Brushes]::White
    $brushGray = [System.Drawing.Brushes]::Silver
    
    # Dibujar contenido
    $g.DrawString($iconSymbol, $fontIcon, $brushWhite, 175, 45)
    $g.DrawString($titleText, $fontTitle, $brushWhite, 35, 115)
    $g.DrawString("TERMINAL // NODO CRIPTOGRAFICO", $fontSub, $brushGray, 55, 145)
    $g.DrawString("[ COPIA AQUI TU ARCHIVO PNG PARA REEMPLAZAR ]", $fontSub, $brushGray, 25, 175)
    
    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generado: $filePath"
}

$assetsDir = "C:\Users\HP\.gemini\antigravity\scratch\cryptic-terminal\assets"

Create-CrypticImage "$assetsDir\popup1.png" "POPUP 01 // ESPECTRO ALFA" "[♣]"
Create-CrypticImage "$assetsDir\popup2.png" "POPUP 02 // VIGILANCIA 02" "[::]"
Create-CrypticImage "$assetsDir\popup3.png" "POPUP 03 // MATRIZ HEXADECIMAL" "[#]"
Create-CrypticImage "$assetsDir\popup4.png" "POPUP 04 // CODIGO FUENTE" "[&]"

# Generar logo
$logoBmp = New-Object System.Drawing.Bitmap 320, 60
$logoG = [System.Drawing.Graphics]::FromImage($logoBmp)
$logoG.Clear([System.Drawing.Color]::Black)
$penLogo = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 1)
$logoG.DrawRectangle($penLogo, 2, 2, 316, 56)
$fontLogo = New-Object System.Drawing.Font('Courier New', 12, [System.Drawing.FontStyle]::Bold)
$logoG.DrawString("♣ TERMINAL_SYS ♣", $fontLogo, [System.Drawing.Brushes]::White, 45, 20)
$logoBmp.Save("$assetsDir\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$logoG.Dispose()
$logoBmp.Dispose()
Write-Host "Logo generado: $assetsDir\logo.png"
