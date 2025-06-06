import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AccessRole } from '@prisma/client';

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { message: 'Name, email, password, and role are required' },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
      access_role: role in AccessRole ? role : AccessRole.USER
    }
  });

  return NextResponse.json(newUser, { status: 201 });
}
