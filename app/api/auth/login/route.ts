import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { comparePassword, signToken } from '@/app/src/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await comparePassword(password, user.password))) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });

        (await cookies()).set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({
            success: true,
            token,
            user: { id: user.id, email: user.email, role: user.role, name: user.name }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Erro Interno do Servidor' }, { status: 500 });
    }
}
