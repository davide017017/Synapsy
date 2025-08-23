#!/usr/bin/env pwsh
set-strictmode -version latest

Write-Host "=== Backend: lint/typecheck/build/test ==="
Push-Location Backend
if(Test-Path vendor/bin/pint){ & vendor/bin/pint --test }
if(Test-Path vendor/bin/phpstan){ & vendor/bin/phpstan analyse }
npm run build --if-present
composer test
Pop-Location

Write-Host "=== Frontend: lint/typecheck/build/test ==="
Push-Location Frontend-nextjs
npm run lint
npm run typecheck
npm run build
npm test --if-present
Pop-Location

Write-Host "=== ML: lint/typecheck/build/test ==="
Push-Location ml_category_suggester
python -m py_compile category_suggester_service.py
if(Test-Path tests){ pytest }
Pop-Location

Write-Host "Audit completed"
