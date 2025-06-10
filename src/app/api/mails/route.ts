import { NextRequest, NextResponse } from 'next/server';
import { EmailStatus } from '@prisma/client';

export async function GET() {
  const emails = await prisma.incomingEmail.findMany();

  return NextResponse.json(emails);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { id, subject, sender, body: emailBody, status } = body;

  if (!subject || !sender || !emailBody) {
    return NextResponse.json({ message: 'Subject, sender, body are required' }, { status: 400 });
  }

  const newEmail = await prisma.incomingEmail.create({
    data: {
      id,
      subject,
      sender,
      body: emailBody,
      status: status in EmailStatus ? status : EmailStatus.UNREADED
    }
  });

  return NextResponse.json(newEmail, { status: 201 });
}
