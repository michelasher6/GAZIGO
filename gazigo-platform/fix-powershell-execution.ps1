# Fix PowerShell Execution Policy for npm
# Run this script as Administrator if needed

Write-Host "Checking current execution policy..." -ForegroundColor Yellow

$currentPolicy = Get-ExecutionPolicy -Scope CurrentUser
Write-Host "Current User Policy: $currentPolicy" -ForegroundColor Cyan

if ($currentPolicy -eq "Restricted") {
    Write-Host "Setting execution policy to RemoteSigned for CurrentUser..." -ForegroundColor Yellow
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "✓ Execution policy updated successfully!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to set execution policy. You may need to run as Administrator." -ForegroundColor Red
        Write-Host "Alternative: Use npm.cmd instead of npm" -ForegroundColor Yellow
        Write-Host "Example: npm.cmd install" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Execution policy is already permissive ($currentPolicy)" -ForegroundColor Green
}

Write-Host "`nTesting npm..." -ForegroundColor Yellow
$npmPath = "C:\Program Files\nodejs\npm.cmd"
if (Test-Path $npmPath) {
    Write-Host "✓ npm found at: $npmPath" -ForegroundColor Green
    Write-Host "You can now use: npm install" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
}




