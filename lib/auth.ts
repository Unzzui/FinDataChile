// Configuración de autenticación: exigir siempre variable de entorno en lugar de valores por defecto
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Función para verificar contraseña
export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    // Si no está configurada, negar acceso por seguridad
    return false;
  }
  return password === ADMIN_PASSWORD;
}

// Función para generar un token de sesión simple
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated(token: string | null): boolean {
  // En un sistema real, verificarías el token en una base de datos
  // Por simplicidad, usamos un token temporal
  return token !== null && token.length > 10;
} 