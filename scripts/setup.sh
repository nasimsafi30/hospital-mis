#!/bin/bash

echo "🏥 Hospital MIS Setup Script"
echo "=============================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/hospital_db?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 32)"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-app-id"
EOL
    echo "✅ .env.local created"
    echo "⚠️  Please update .env.local with your actual credentials"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client and push schema
echo "🗄️ Setting up database..."
npx drizzle-kit generate:pg
npx drizzle-kit push:pg

# Seed database (if seed script exists)
if [ -f "scripts/seed.ts" ]; then
    echo "🌱 Seeding database..."
    npx tsx scripts/seed.ts
fi

# Build the application
echo "🏗️ Building application..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📱 Open http://localhost:3000 in your browser"
echo ""
echo "📧 Default admin credentials:"
echo "   Email: admin@hospital.com"
echo "   Password: Admin@123"
echo ""
echo "⚠️  Don't forget to change the admin password after first login!"