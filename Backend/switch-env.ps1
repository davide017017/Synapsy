# ==========================================
# PowerShell script per cambiare il file .env
# Uso: .\switch-env.ps1 local   --> usa .env.local
#      .\switch-env.ps1 beta    --> usa .env.beta
#      .\switch-env.ps1 prod    --> usa .env.prod
# ==========================================
param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "beta", "prod")]
    [string]$envType
)

$envFile = ".env.$envType"

if (-Not (Test-Path $envFile)) {
    Write-Host "❌ Il file $envFile non esiste!"
    exit 1
}

Copy-Item -Path $envFile -Destination ".env" -Force
Write-Host "✅ Ambiente $envType attivo!"
