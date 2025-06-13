import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { simpleParser } from 'mailparser';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    // Try to get mail from database first
    let dbMail = await prisma.incomingEmail.findUnique({
      where: { id },
      select: { status: true, response: true }
    });

    // Try to read from .eml file
    const filePath = path.join(process.cwd(), 'public/mock-data/income-mails', `${id}.eml`);
    let mail;
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      mail = await simpleParser(content);
    } catch (error) {
      console.error('Error reading .eml file:', error);
      return NextResponse.json({ error: 'Mail file not found' }, { status: 404 });
    }

    // Get response files if they exist
    const responseDir = path.join(process.cwd(), 'public/eml-attachments', `response-${id}`);
    let excelFiles: { filename: string; url: string }[] = [];
    try {
      const files = await fs.readdir(responseDir);
      excelFiles = files
        .filter((file) => /\.(xls|xlsx)$/i.test(file))
        .map((file) => ({
          filename: file,
          url: `/eml-attachments/response-${id}/${file}`
        }));
    } catch (error) {
      // If directory doesn't exist, excelFiles will remain empty
      console.log('No response files found');
    }

    return NextResponse.json({
      id,
      subject: mail.subject,
      from: mail.from?.text,
      to: mail.to?.text,
      date: mail.date,
      text: mail.text,
      status: dbMail?.status || 'UNREADED',
      response: dbMail?.response || '',
      attachments: mail.attachments.map((att) => ({
        filename: att.filename,
        contentType: att.contentType
      })),
      excelFiles
    });
  } catch (error) {
    console.error('Error loading mail:', error);
    return NextResponse.json({ error: 'Failed to load mail' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Try to read mail data from .eml file
    const filePath = path.join(process.cwd(), 'public/mock-data/income-mails', `${id}.eml`);
    let mail;
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      mail = await simpleParser(content);
    } catch (error) {
      console.error('Error reading .eml file:', error);
      return NextResponse.json({ error: 'Mail file not found' }, { status: 404 });
    }

    // Update or create mail in database
    const dbMail = await prisma.incomingEmail.upsert({
      where: { id },
      update: {
        status: body.status,
        response: body.response
      },
      create: {
        id,
        subject: mail.subject || '(No subject)',
        sender: mail.from?.text || '',
        body: mail.text || '',
        status: body.status || 'UNREADED',
        response: body.response || ''
      }
    });

    return NextResponse.json(dbMail);
  } catch (error) {
    console.error('Error updating mail:', error);
    return NextResponse.json({ error: 'Failed to update mail' }, { status: 500 });
  }
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
