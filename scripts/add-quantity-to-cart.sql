-- Agregar columna quantity a cart_items
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Actualizar registros existentes para que tengan quantity = 1
UPDATE cart_items SET quantity = 1 WHERE quantity IS NULL;

-- Hacer que quantity no sea null
ALTER TABLE cart_items ALTER COLUMN quantity SET NOT NULL;
