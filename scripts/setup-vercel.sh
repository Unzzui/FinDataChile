#!/bin/bash

# Script de configuración para deployment en Vercel
# Este script te ayuda a configurar todo lo necesario para el deploy

echo "🚀 Configuración de Vercel Deployment"
echo "===================================="

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo ""
echo "📋 Checklist de configuración:"
echo ""

# 1. Verificar variables de entorno
echo "1. ✅ Variables de entorno configuradas"
if [ -f ".env.local" ]; then
    echo "   - .env.local existe"
else
    echo "   ❌ Falta .env.local - copia desde env.example"
fi

# 2. Verificar dependencias
echo ""
echo "2. 📦 Verificando dependencias..."
if npm list @vercel/blob > /dev/null 2>&1; then
    echo "   ✅ @vercel/blob instalado"
else
    echo "   ⚠️  Instalando @vercel/blob..."
    npm install @vercel/blob --legacy-peer-deps
fi

# 3. Crear vercel.json si no existe
echo ""
echo "3. ⚙️  Configuración de Vercel..."
if [ ! -f "vercel.json" ]; then
    cat > vercel.json << EOF
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "env": {
    "BLOB_READ_WRITE_TOKEN": "@blob_read_write_token",
    "USER_JWT_SECRET": "@user_jwt_secret",
    "ADMIN_JWT_SECRET": "@admin_jwt_secret",
    "DATABASE_URL": "@database_url"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/download/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
EOF
    echo "   ✅ vercel.json creado"
else
    echo "   ✅ vercel.json ya existe"
fi

# 4. Información sobre las variables de entorno
echo ""
echo "4. 🔐 Variables de entorno para Vercel:"
echo "   Necesitarás configurar estas variables en Vercel Dashboard:"
echo ""
echo "   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_..."
echo "   USER_JWT_SECRET=$(head -c 32 /dev/urandom | base64)"
echo "   ADMIN_JWT_SECRET=$(head -c 32 /dev/urandom | base64)"
echo "   DATABASE_URL=postgresql://..."
echo ""

# 5. Comandos útiles
echo "5. 🛠️  Comandos útiles:"
echo ""
echo "   # Instalar Vercel CLI:"
echo "   npm i -g vercel"
echo ""
echo "   # Deploy a Vercel:"
echo "   vercel"
echo ""
echo "   # Deploy con variables de entorno:"
echo "   vercel --env BLOB_READ_WRITE_TOKEN=tu_token"
echo ""

# 6. Costos estimados
echo "6. 💰 Costos estimados para archivos de 30KB:"
echo ""
echo "   📊 Vercel Blob Storage:"
echo "   - 1,000 archivos (30MB): ~$0.005/mes"
echo "   - 10,000 archivos (300MB): ~$0.05/mes"
echo "   - 100,000 archivos (3GB): ~$0.45/mes"
echo ""
echo "   📊 Vercel Functions:"
echo "   - Plan hobby: 100GB-hrs gratis/mes"
echo "   - Plan Pro: $20/mes + 1000GB-hrs gratis"
echo ""

echo "✅ Configuración completada!"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Crear cuenta en Vercel (vercel.com)"
echo "2. Conectar tu repositorio de GitHub"
echo "3. Configurar las variables de entorno en Vercel Dashboard"
echo "4. Obtener el BLOB_READ_WRITE_TOKEN desde Vercel Storage"
echo "5. ¡Deploy automático!"
echo ""
