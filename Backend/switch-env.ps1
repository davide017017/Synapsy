# ==========================================
# PowerShell script per cambiare il file .env
# Uso: .\switch-env.ps1 local   --> usa .env.local
#      .\switch-env.ps1 beta    --> usa .env.beta
# ==========================================

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "beta")]
    [string]$envType
)

$envFile = ".env.$envType"

if (-Not (Test-Path $envFile)) {
    Write-Host "❌ Il file $envFile non esiste nella cartella corrente!"
    exit 1
}

Copy-Item -Path $envFile -Destination ".env" -Force

Write-Host "✅ Ambiente $envType attivo! ($envFile -> .env)"

