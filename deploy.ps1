# Script de deploy para Vercel
# Ejecuta este script con: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "Configurando deploy en Vercel..." -ForegroundColor Green

# Verificar si vercel está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI no encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Ejecutar deploy
Write-Host "Ejecutando vercel..." -ForegroundColor Yellow
vercel

Write-Host ""
Write-Host "Si es la primera vez, vercel te pedirá iniciar sesión." -ForegroundColor Cyan
Write-Host "Después de configurar el proyecto, recuerda agregar las variables de entorno:" -ForegroundColor Cyan
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_API_KEY"
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID"
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_APP_ID"
Write-Host "  vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
