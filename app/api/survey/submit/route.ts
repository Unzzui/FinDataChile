import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface SurveyResponse {
  id: string;
  wouldPay: boolean;
  name: string;
  email: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

// Función para cargar respuestas existentes
async function loadSurveyResponses(): Promise<SurveyResponse[]> {
  try {
    const responsesPath = path.join(process.cwd(), 'data', 'survey-responses.json');
    const data = await fs.readFile(responsesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, crear uno vacío
    return [];
  }
}

// Función para guardar respuestas
async function saveSurveyResponses(responses: SurveyResponse[]): Promise<void> {
  const responsesPath = path.join(process.cwd(), 'data', 'survey-responses.json');
  await fs.writeFile(responsesPath, JSON.stringify(responses, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wouldPay, name, email } = body;

    if (typeof wouldPay !== 'boolean' || !name || !email) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Crear nueva respuesta
    const newResponse: SurveyResponse = {
      id: Math.random().toString(36).substr(2, 9),
      wouldPay,
      name,
      email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
    };

    // Cargar respuestas existentes
    const responses = await loadSurveyResponses();
    
    // Agregar nueva respuesta
    responses.push(newResponse);
    
    // Guardar todas las respuestas
    await saveSurveyResponses(responses);

    // Calcular estadísticas
    const totalResponses = responses.length;
    const positiveResponses = responses.filter(r => r.wouldPay).length;
    const positivePercentage = totalResponses > 0 ? (positiveResponses / totalResponses * 100).toFixed(1) : '0';

    return NextResponse.json({
      success: true,
      message: 'Respuesta guardada exitosamente',
      stats: {
        total: totalResponses,
        positive: positiveResponses,
        positivePercentage,
      }
    });

  } catch (error) {
    console.error('Error guardando respuesta de encuesta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener estadísticas (solo para admin)
export async function GET(request: NextRequest) {
  try {
    const responses = await loadSurveyResponses();
    
    const totalResponses = responses.length;
    const positiveResponses = responses.filter(r => r.wouldPay).length;
    const negativeResponses = responses.filter(r => !r.wouldPay).length;
    const positivePercentage = totalResponses > 0 ? (positiveResponses / totalResponses * 100).toFixed(1) : '0';

    return NextResponse.json({
      total: totalResponses,
      positive: positiveResponses,
      negative: negativeResponses,
      positivePercentage,
      responses: responses.slice(-10), // Últimas 10 respuestas
    });

  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 