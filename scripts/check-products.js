const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function checkProducts() {
  const dbPath = path.join(__dirname, '..', 'data', 'findata.db');
  const db = new sqlite3.Database(dbPath);

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        id,
        company_name,
        sector,
        year_range,
        price,
        is_active,
        file_path,
        created_at
      FROM products 
      ORDER BY company_name
    `, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      console.log('=== ESTADO DE PRODUCTOS EN LA BASE DE DATOS ===');
      console.log(`Total de productos: ${rows.length}`);
      
      const activeProducts = rows.filter(p => p.is_active);
      const inactiveProducts = rows.filter(p => !p.is_active);
      
      console.log(`Productos activos: ${activeProducts.length}`);
      console.log(`Productos inactivos: ${inactiveProducts.length}`);
      
      console.log('\n=== PRODUCTOS POR SECTOR ===');
      const sectorCount = rows.reduce((acc, p) => {
        acc[p.sector] = (acc[p.sector] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(sectorCount).forEach(([sector, count]) => {
        console.log(`${sector}: ${count}`);
      });
      
      console.log('\n=== PRODUCTOS INACTIVOS ===');
      inactiveProducts.forEach(p => {
        console.log(`- ${p.company_name} (${p.sector}) - ${p.year_range} - ID: ${p.id}`);
      });
      
      console.log('\n=== PRIMEROS 10 PRODUCTOS ACTIVOS ===');
      activeProducts.slice(0, 10).forEach(p => {
        console.log(`- ${p.company_name} (${p.sector}) - ${p.year_range} - $${p.price}`);
      });
      
      db.close();
      resolve();
    });
  });
}

checkProducts().catch(console.error); 