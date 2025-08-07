const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de variables de entorno...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env no encontrado');
  console.log('📝 Crea el archivo .env con las siguientes variables:');
  console.log('');
  console.log('ADMIN_USERNAME=tu_usuario_admin');
  console.log('ADMIN_PASSWORD=tu_password_seguro_123');
  console.log('');
  console.log('💡 Copia el archivo env.example como .env y configura tus valores');
  process.exit(1);
}

// Leer y verificar variables
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('✅ Archivo .env encontrado');
console.log('');

// Verificar variables requeridas
const requiredVars = ['ADMIN_USERNAME', 'ADMIN_PASSWORD'];
let allConfigured = true;

requiredVars.forEach(varName => {
  if (envVars[varName] && !envVars[varName].includes('tu_')) {
    console.log(`✅ ${varName}: Configurado`);
  } else {
    console.log(`❌ ${varName}: No configurado o usando valor por defecto`);
    allConfigured = false;
  }
});

console.log('');

if (allConfigured) {
  console.log('🎉 Configuración completa! El sistema está listo para producción.');
} else {
  console.log('⚠️  Configura las variables requeridas antes de usar en producción.');
  console.log('');
  console.log('📋 Variables opcionales pero recomendadas:');
  console.log('- SMTP_USER y SMTP_PASS (para emails)');
  console.log('- TRANSBANK_COMMERCE_CODE y TRANSBANK_API_KEY (para pagos reales)');
  console.log('- JWT_SECRET y NEXTAUTH_SECRET (para seguridad)');
} 