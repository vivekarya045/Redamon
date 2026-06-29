import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createToken, hashPassword, AUTH_COOKIE_NAME } from '@/lib/auth'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    const normalizedEmail = typeof email === 'string' ? normalizeEmail(email) : ''

    if (!name || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters' },
        { status: 400 }
      )
    }

    const userCount = await prisma.user.count()
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: await hashPassword(password),
        role: userCount === 0 ? 'admin' : 'standard',
      },
      select: { id: true, name: true, email: true, role: true },
    })

    const token = await createToken(user.id, user.role)
    const response = NextResponse.json(user, { status: 201 })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error: unknown) {
    console.error('Signup error:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
