#!/usr/bin/env tsx

import { pgQuery } from '../lib/pg'
import { readFileSync } from 'fs'
import { resolve } from 'path'

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración de base de datos...')
    
    // Leer el archivo de esquema
    const schemaPath = resolve(__dirname, '../lib/postgres-migration-schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    // Ejecutar la migración completa
    await pgQuery(schema)
    
    console.log('✅ Migración completada exitosamente')
    console.log('✅ Tabla subscription_survey creada/actualizada')
    
    // Verificar que la tabla se creó correctamente
    const { rows } = await pgQuery(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'subscription_survey'
      ORDER BY ordinal_position
    `)
    
    console.log('\n📋 Estructura de la tabla subscription_survey:')
    rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}${row.is_nullable === 'YES' ? ' (nullable)' : ' (not null)'}`)
    })
    
  } catch (error) {
    console.error('❌ Error en migración:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

runMigration()
