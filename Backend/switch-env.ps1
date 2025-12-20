# ==========================================
# PowerShell script per cambiare il file .env
# Uso:    .\switch-env.ps1 local
#         .\switch-env.ps1 development
#         .\switch-env.ps1 production

# ==========================================
param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "development", "production")]
    [string]$envType
)

$envFile = ".env.$envType"

if (-Not (Test-Path $envFile)) {
    Write-Host "❌ Il file $envFile non esiste!"
    exit 1
}

Copy-Item -Path $envFile -Destination ".env" -Force
Write-Host "✅ Ambiente $envType attivo!"
