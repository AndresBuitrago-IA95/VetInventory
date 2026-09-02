# Script de instalación para VetInventory
# Ejecuta este script con: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "Instalando dependencias de VetInventory..." -ForegroundColor Green

# Cambiar la política de ejecución temporalmente
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# Instalar dependencias
Write-Host "Ejecutando npm install..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Instalación completada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pasos siguientes:" -ForegroundColor Cyan
    Write-Host "1. Copia .env.local.example a .env.local y configura tus credenciales de Firebase"
    Write-Host "2. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo"
    Write-Host "3. Para deploy en Vercel, ejecuta 'vercel' y sigue las instrucciones"
} else {
    Write-Host "Error durante la instalación. Revisa los mensajes de error arriba." -ForegroundColor Red
}

# Restaurar política de ejecución
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Default -Force
