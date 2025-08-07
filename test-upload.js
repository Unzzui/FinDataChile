const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

async function testUpload() {
  try {
    console.log('🧪 Probando sistema de carga masiva...');
    
    // Crear FormData
    const formData = new FormData();
    
    // Agregar archivos Excel
    const file1 = fs.createReadStream(path.join(__dirname, 'public/excel-products/COLBUN_SA_EEFF_Balance_Resultados_Flujos_Anual_2017-2024.xlsx'));
    const file2 = fs.createReadStream(path.join(__dirname, 'public/excel-products/COLBUN_SA_EEFF_Balance_Resultados_Flujos_Anual_2021-2024.xlsx'));
    
    formData.append('files', file1);
    formData.append('files', file2);
    
    console.log('📤 Enviando archivos a la API...');
    
    // Enviar a la API usando axios
    const response = await axios.post('http://localhost:3002/api/admin/process-excel', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    const result = response.data;
    console.log('✅ Resultado:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpload(); 