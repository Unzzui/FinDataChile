-- Schema para migración a PostgreSQL
-- Mantiene compatibilidad con SQLite pero optimizado para PostgreSQL

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  company_id INTEGER NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  year_range VARCHAR(50) NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nueva tabla para almacenar archivos Excel directamente en BD
CREATE TABLE IF NOT EXISTS product_files (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  filename VARCHAR(255) NOT NULL,
  file_content BYTEA NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) DEFAULT 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id)
);

-- Tabla de carrito
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, product_id)
);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de descargas
CREATE TABLE IF NOT EXISTS download_history (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transbank_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Tabla de productos por transacción
CREATE TABLE IF NOT EXISTS transaction_products (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(255) REFERENCES transactions(id),
  product_id VARCHAR(255) REFERENCES products(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para encuesta de suscripciones
CREATE TABLE IF NOT EXISTS subscription_survey (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  would_pay BOOLEAN NOT NULL,
  interests JSONB DEFAULT '[]'::jsonb, -- Array de intereses seleccionados
  use_case TEXT, -- Descripción del caso de uso
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sector ON products(sector);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_email);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON download_history(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_survey_email ON subscription_survey(email);
CREATE INDEX IF NOT EXISTS idx_subscription_survey_would_pay ON subscription_survey(would_pay);
CREATE INDEX IF NOT EXISTS idx_subscription_survey_created_at ON subscription_survey(created_at);

-- Comentarios para documentación
COMMENT ON TABLE product_files IS 'Almacena los archivos Excel directamente en la base de datos como BYTEA';
COMMENT ON COLUMN product_files.file_content IS 'Contenido binario del archivo Excel (máx ~30KB por archivo)';
COMMENT ON COLUMN product_files.file_size IS 'Tamaño del archivo en bytes para validación';
COMMENT ON TABLE subscription_survey IS 'Almacena respuestas de la encuesta de interés en suscripciones premium';
