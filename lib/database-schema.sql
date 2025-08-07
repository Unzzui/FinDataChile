-- Esquema de base de datos para FinData Chile

-- Tabla de productos
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    company_id INTEGER NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    year_range VARCHAR(50) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE transactions (
    id VARCHAR(255) PRIMARY KEY,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    transbank_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabla de productos en transacciones
CREATE TABLE transaction_products (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) REFERENCES transactions(id),
    product_id VARCHAR(255) REFERENCES products(id),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    next_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empresas suscritas
CREATE TABLE subscription_companies (
    id SERIAL PRIMARY KEY,
    subscription_id VARCHAR(255) REFERENCES subscriptions(id),
    company_id INTEGER NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_products_sector ON products(sector);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_email ON transactions(customer_email);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_email ON subscriptions(user_email); 