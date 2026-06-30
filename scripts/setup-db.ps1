Write-Host "Setting up database..." -ForegroundColor Yellow
npx drizzle-kit generate
npx drizzle-kit push
Write-Host "✅ Database setup complete!" -ForegroundColor Green