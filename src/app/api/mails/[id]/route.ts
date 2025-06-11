import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db/prisma';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const email = await prisma.incomingEmail.findUnique({
    where: {
      id: id
    }
  });

  if (!email) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  return NextResponse.json(email);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { id } = await params;
  const { subject, sender, body: emailBody, status } = body;

  if (!subject || !sender) {
    return NextResponse.json({ message: 'Subject, sender, are required' }, { status: 400 });
  }

  const existingEmail = await prisma.incomingEmail.findUnique({
    where: { id: id }
  });

  if (!existingEmail) {
    return NextResponse.json({ message: 'Email not found' }, { status: 404 });
  }

  const updatedEmail = await prisma.incomingEmail.update({
    where: { id: id },
    data: {
      subject,
      sender,
      body: emailBody,
      status
    }
  });

  return NextResponse.json(updatedEmail);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const body = await request.json();
  const { status, response } = body;

  console.log('Updating email with ID:', id, 'Status:', status, 'Response:', response);

  const existingEmail = await prisma.incomingEmail.findUnique({
    where: { id: id }
  });

  if (!existingEmail) {
    return NextResponse.json({ message: 'Email not found' }, { status: 404 });
  }

  const updatedEmail = await prisma.incomingEmail.update({
    where: { id: id },
    data: { status, response }
  });

  return NextResponse.json(updatedEmail);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const existingEmail = await prisma.incomingEmail.findUnique({
    where: { id: id }
  });

  if (!existingEmail) {
    return NextResponse.json({ message: 'Email not found' }, { status: 404 });
  }

  await prisma.incomingEmail.delete({
    where: { id: id }
  });

  return NextResponse.json({ message: 'Email deleted successfully' });
}
