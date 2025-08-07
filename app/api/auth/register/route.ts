import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/database';
import { createUserToken } from '@/lib/user-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const userId = await createUser(email, name, password);
    const token = createUserToken({ sub: String(userId), email, name })
    const res = NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId
    })
    res.cookies.set('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res

  } catch (error) {
    console.error('Error registrando usuario:', error);
    
    if (error instanceof Error && error.message.includes('ya está registrado')) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 