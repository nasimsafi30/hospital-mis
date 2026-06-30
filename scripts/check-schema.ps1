Write-Host "Checking schema..." -ForegroundColor Yellow
$content = Get-Content "src/lib/db/schema.ts" -Raw
$tables = ([regex]::Matches($content, "export const \w+ = pgTable")).Count
Write-Host "Tables found: $tables" -ForegroundColor Green