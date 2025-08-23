#!/usr/bin/env pwsh
set-strictmode -version latest

$jobs = @()
$jobs += Start-Job { Set-Location Backend; npm run dev }
$jobs += Start-Job { Set-Location Frontend-nextjs; npm run dev }
$jobs += Start-Job { python ml_category_suggester/category_suggester_service.py }

Write-Host "Dev services started. Press Ctrl+C to stop."
Wait-Job $jobs
