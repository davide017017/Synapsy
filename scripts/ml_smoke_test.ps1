# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Utils stampa
# Dettagli: funzioni helper colorate
# ─────────────────────────────────────────────────────────────────────────────
function Write-Ok($msg){ Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warn($msg){ Write-Host "⚠️ $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "❌ $msg" -ForegroundColor Red }

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: HTTP helper
# Dettagli: invoca endpoint JSON
# ─────────────────────────────────────────────────────────────────────────────
function Invoke-Json($method,$url,$headers,$body=$null){
    try{
        $params=@{Method=$method;Uri=$url;Headers=$headers;ContentType="application/json";TimeoutSec=5}
        if($body){$params.Body=($body|ConvertTo-Json)}
        return Invoke-RestMethod @params
    }catch{throw}
}

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Test ML
# Dettagli: health + prediction
# ─────────────────────────────────────────────────────────────────────────────
function Test-Health($mlBase){
    try{
        $res=Invoke-Json 'GET' "$mlBase/health" @{}
        if($res.status -eq 'ok'){Write-Ok "ML health";return $true}
        Write-Err "ML health payload";return $false
    }catch{Write-Err "ML health $_";return $false}
}

function Test-PredictPizza($mlBase){
    try{
        $res=Invoke-Json 'POST' "$mlBase/predict-category" @{} @{description="Pizza Margherita"}
        if($res.category -eq 'cibo' -and [double]$res.confidence -ge 0.9){Write-Ok "ML predict";return $true}
        Write-Err "ML predict mismatch";return $false
    }catch{Write-Err "ML predict $_";return $false}
}

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Test Laravel
# Dettagli: suggest category via Sanctum
# ─────────────────────────────────────────────────────────────────────────────
function Test-LaravelSuggest($apiBase,$token){
    try{
        $h=@{Authorization="Bearer $token"}
        $res=Invoke-Json 'POST' "$apiBase/api/v1/ml/suggest-category" $h @{description="Affitto agosto"}
        if($res.category -eq 'casa' -and [double]$res.confidence -ge 0.7){Write-Ok "Laravel suggest";return $true}
        Write-Err "Laravel suggest mismatch";return $false
    }catch{Write-Err "Laravel suggest $_";return $false}
}

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Main
# Dettagli: orchestrazione smoke test
# ─────────────────────────────────────────────────────────────────────────────
param(
    [string]$MlBase="http://127.0.0.1:7001",
    [string]$ApiBase="http://127.0.0.1:8000",
    [string]$Token=""
)

Write-Host "ML Base: $MlBase"
Write-Host "API Base: $ApiBase"
if($Token){Write-Host "Token: ****"}else{Write-Warn "Token assente"}

$all=$true
$all=(Test-Health $MlBase) -and $all
$all=(Test-PredictPizza $MlBase) -and $all
if($Token){$all=(Test-LaravelSuggest $ApiBase $Token) -and $all}else{Write-Warn "Laravel skipped"}

if($all){Write-Ok "Smoke test completed";exit 0}else{Write-Err "Smoke test failed";exit 1}

# Esempi:
# powershell -ExecutionPolicy Bypass -File .\scripts\ml_smoke_test.ps1
# powershell -ExecutionPolicy Bypass -File .\scripts\ml_smoke_test.ps1 -MlBase http://localhost:7001 -ApiBase http://localhost:8000 -Token "<SANCTUM_TOKEN>"
