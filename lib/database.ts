import bcrypt from 'bcryptjs'
import { pgQuery } from './pg'

// Solo Postgres
function isPostgresEnabled() {
  return true
}

// Funciones de usuario
export async function createUser(email: string, name: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10)
  if (isPostgresEnabled()) {
    try {
      const { rows } = await pgQuery<{ id: number }>(
        'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [email, name, passwordHash]
      )
      return rows[0]?.id
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new Error('El email ya está registrado')
      }
      throw error
    }
  } else {
    const db = await getDatabase()
    try {
      const result = await db.run(
        'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
        [email, name, passwordHash]
      )
      return result.lastID
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        throw new Error('El email ya está registrado')
      }
      throw error
    }
  }
}

export async function authenticateUser(email: string, password: string) {
  let user: any
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery('SELECT * FROM users WHERE email = $1', [email])
    user = rows[0]
  } else {
    const db = await getDatabase()
    user = await db.get('SELECT * FROM users WHERE email = ?', [email])
  }
  
  if (!user) {
    return null
  }
  
  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return null
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
}

export async function getUserById(id: number) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery('SELECT id, email, name, created_at FROM users WHERE id = $1', [id])
    return rows[0]
  }
  const db = await getDatabase()
  return await db.get('SELECT id, email, name, created_at FROM users WHERE id = ?', [id])
}

// Funciones de carrito
export async function addToCart(userEmail: string, productId: string) {
  if (isPostgresEnabled()) {
    try {
      await pgQuery('INSERT INTO cart_items (user_email, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userEmail, productId])
      return true
    } catch {
      return false
    }
  } else {
    const db = await getDatabase()
    try {
      await db.run('INSERT INTO cart_items (user_email, product_id) VALUES (?, ?)', [userEmail, productId])
      return true
    } catch {
      return false
    }
  }
}

export async function removeFromCart(userEmail: string, productId: string) {
  if (isPostgresEnabled()) {
    await pgQuery('DELETE FROM cart_items WHERE user_email = $1 AND product_id = $2', [userEmail, productId])
  } else {
    const db = await getDatabase()
    await db.run('DELETE FROM cart_items WHERE user_email = ? AND product_id = ?', [userEmail, productId])
  }
}

export async function getCartItems(userEmail: string) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery(`
      SELECT ci.*, p.company_name, p.sector, p.year_range, p.price, p.description
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_email = $1
      ORDER BY ci.created_at DESC
    `, [userEmail])
    return rows
  } else {
    const db = await getDatabase()
    return await db.all(`
      SELECT ci.*, p.company_name, p.sector, p.year_range, p.price, p.description
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_email = ?
      ORDER BY ci.created_at DESC
    `, [userEmail])
  }
}

export async function clearCart(userEmail: string) {
  if (isPostgresEnabled()) {
    await pgQuery('DELETE FROM cart_items WHERE user_email = $1', [userEmail])
  } else {
    const db = await getDatabase()
    await db.run('DELETE FROM cart_items WHERE user_email = ?', [userEmail])
  }
}

// Funciones de compras
export async function createPurchase(userEmail: string, userName: string, productId: string, amount: number) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery<{ id: number }>(
      'INSERT INTO purchases (user_email, user_name, product_id, amount) VALUES ($1, $2, $3, $4) RETURNING id',
      [userEmail, userName, productId, amount]
    )
    return rows[0]?.id
  } else {
    const db = await getDatabase()
    const result = await db.run('INSERT INTO purchases (user_email, user_name, product_id, amount) VALUES (?, ?, ?, ?)', [userEmail, userName, productId, amount])
    return result.lastID
  }
}

export async function getUserPurchases(userEmail: string) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery(`
      SELECT p.*, pr.company_name, pr.sector, pr.year_range, pr.price, pr.description
      FROM purchases p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.user_email = $1
      ORDER BY p.created_at DESC
    `, [userEmail])
    return rows
  } else {
    const db = await getDatabase()
    return await db.all(`
      SELECT p.*, pr.company_name, pr.sector, pr.year_range, pr.price, pr.description
      FROM purchases p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.user_email = ?
      ORDER BY p.created_at DESC
    `, [userEmail])
  }
}

// Funciones de descargas
export async function recordDownload(userEmail: string, productId: string) {
  if (isPostgresEnabled()) {
    await pgQuery('INSERT INTO download_history (user_email, product_id) VALUES ($1, $2)', [userEmail, productId])
  } else {
    const db = await getDatabase()
    await db.run('INSERT INTO download_history (user_email, product_id) VALUES (?, ?)', [userEmail, productId])
  }
}

export async function getUserDownloadHistory(userEmail: string) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery(`
      SELECT dh.*, pr.company_name, pr.sector, pr.year_range, pr.description
      FROM download_history dh
      LEFT JOIN products pr ON dh.product_id = pr.id
      WHERE dh.user_email = $1
      ORDER BY dh.downloaded_at DESC
    `, [userEmail])
    return rows
  } else {
    const db = await getDatabase()
    return await db.all(`
      SELECT dh.*, pr.company_name, pr.sector, pr.year_range, pr.description
      FROM download_history dh
      LEFT JOIN products pr ON dh.product_id = pr.id
      WHERE dh.user_email = ?
      ORDER BY dh.downloaded_at DESC
    `, [userEmail])
  }
}

// Función para verificar si un usuario puede descargar un producto
export async function canUserDownload(userEmail: string, productId: string) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery<{ id: number }>(
      "SELECT id FROM purchases WHERE user_email = $1 AND product_id = $2 AND status = 'completed'",
      [userEmail, productId]
    )
    return rows.length > 0
  } else {
    const db = await getDatabase()
    const purchase = await db.get(
      'SELECT id FROM purchases WHERE user_email = ? AND product_id = ? AND status = "completed"',
      [userEmail, productId]
    )
    return !!purchase
  }
} 

// Productos
export async function getProductById(productId: string) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery('SELECT * FROM products WHERE id = $1', [productId])
    return rows[0]
  } else {
    const db = await getDatabase()
    return await db.get('SELECT * FROM products WHERE id = ?', [productId])
  }
}

export async function getProductsByIds(productIds: string[]) {
  if (productIds.length === 0) return []
  if (isPostgresEnabled()) {
    const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',')
    const { rows } = await pgQuery(`SELECT id, price FROM products WHERE id IN (${placeholders})`, productIds)
    return rows as Array<{ id: string; price: number }>
  } else {
    const db = await getDatabase()
    const placeholders = productIds.map(() => '?').join(',')
    return await db.all(`SELECT id, price FROM products WHERE id IN (${placeholders})`, productIds)
  }
}

export interface UpsertProductInput {
  id: string
  companyId: number
  companyName: string
  sector: string
  yearRange: string
  startYear: number
  endYear: number
  price: number
  filePath: string
  description: string
  isQuarterly: boolean
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export async function upsertProduct(product: UpsertProductInput) {
  if (isPostgresEnabled()) {
    await pgQuery(
      `INSERT INTO products (
        id, company_id, company_name, sector, year_range,
        start_year, end_year, price, file_path, description,
        is_active, created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      ) ON CONFLICT (id) DO UPDATE SET
        company_id = EXCLUDED.company_id,
        company_name = EXCLUDED.company_name,
        sector = EXCLUDED.sector,
        year_range = EXCLUDED.year_range,
        start_year = EXCLUDED.start_year,
        end_year = EXCLUDED.end_year,
        price = EXCLUDED.price,
        file_path = EXCLUDED.file_path,
        description = EXCLUDED.description,
        is_active = EXCLUDED.is_active,
        updated_at = EXCLUDED.updated_at
      `,
      [
        product.id,
        product.companyId,
        product.companyName,
        product.sector,
        product.yearRange,
        product.startYear,
        product.endYear,
        product.price,
        product.filePath,
        product.description,
        product.isActive,
        typeof product.createdAt === 'string' ? product.createdAt : product.createdAt.toISOString(),
        typeof product.updatedAt === 'string' ? product.updatedAt : product.updatedAt.toISOString(),
      ]
    )
  } else {
    const db = await getDatabase()
    await db.run(
      `INSERT OR REPLACE INTO products (
        id, company_id, company_name, sector, year_range,
        start_year, end_year, price, file_path, description,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.companyId,
        product.companyName,
        product.sector,
        product.yearRange,
        product.startYear,
        product.endYear,
        product.price,
        product.filePath,
        product.description,
        product.isActive,
        typeof product.createdAt === 'string' ? product.createdAt : product.createdAt.toISOString(),
        typeof product.updatedAt === 'string' ? product.updatedAt : product.updatedAt.toISOString(),
      ]
    )
  }
}

export async function getUserPurchasedFiles(userEmail: string) {
  if (isPostgresEnabled()) {
    const { rows } = await pgQuery(
      `SELECT p.product_id, pr.company_name, pr.sector, pr.year_range, pr.file_path, pr.description
       FROM purchases p
       JOIN products pr ON p.product_id = pr.id
       WHERE p.user_email = $1 AND p.status = 'completed'
       ORDER BY pr.company_name`,
      [userEmail]
    )
    return rows
  } else {
    const db = await getDatabase()
    return await db.all(
      `SELECT p.product_id, pr.company_name, pr.sector, pr.year_range, pr.file_path, pr.description
       FROM purchases p
       JOIN products pr ON p.product_id = pr.id
       WHERE p.user_email = ? AND p.status = 'completed'
       ORDER BY pr.company_name`,
      [userEmail]
    )
  }
}