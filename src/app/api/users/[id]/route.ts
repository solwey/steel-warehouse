import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const body = await request.json();
  const { name, email, password, role, display_name } = body;

  if (!name || !email || !role) {
    return NextResponse.json({ message: 'Name, email, and role are required' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser && existingUser.id !== id) {
    return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
  }

  let updateData: any = {
    name,
    email,
    access_role: role
  };

  if (display_name !== undefined) {
    updateData.display_name = display_name;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    updateData.password_hash = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData
  });

  return NextResponse.json(updatedUser);
}
