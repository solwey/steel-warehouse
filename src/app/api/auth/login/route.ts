import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'secret';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
  }

  const token = sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  return NextResponse.json({ token });
}
