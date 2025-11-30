import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const signToken = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const getSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
        return verifyToken(token) as { id: string; email: string; role: string } | null;
    }

    const { headers } = await import('next/headers');
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const bearerToken = authHeader.split(' ')[1];
        return verifyToken(bearerToken) as { id: string; email: string; role: string } | null;
    }

    return null;
};
