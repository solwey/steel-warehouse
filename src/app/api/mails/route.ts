import { NextRequest, NextResponse } from 'next/server';
import { EmailStatus } from '@prisma/client';
import prisma from '@/lib/db/prisma';
import fs from 'fs/promises';
import path from 'path';
import { simpleParser } from 'mailparser';

export async function GET() {
  try {
    const mailsDir = path.join(process.cwd(), 'public/mock-data/income-mails');
    const files = await fs.readdir(mailsDir);
    const emlFiles = files.filter((file) => file.endsWith('.eml'));

    const mails = await Promise.all(
      emlFiles.map(async (filename) => {
        const filePath = path.join(mailsDir, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const mail = await simpleParser(content);
        const id = filename.replace('.eml', '');

        // Get mail status from database
        const dbMail = await prisma.incomingEmail.findUnique({
          where: { id },
          select: { status: true, response: true }
        });

        return {
          id,
          subject: mail.subject,
          from: mail.from?.text,
          to: mail.to?.text,
          date: mail.date,
          text: mail.text,
          bodySnippet: mail.text?.substring(0, 150) + '...',
          status: dbMail?.status || 'UNREADED',
          response: dbMail?.response || '',
          attachments: mail.attachments.map((att) => ({
            filename: att.filename,
            contentType: att.contentType
          }))
        };
      })
    );

    // Sort mails by date, newest first
    mails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(mails);
  } catch (error) {
    console.error('Error loading mails:', error);
    return NextResponse.json({ error: 'Failed to load mails' }, { status: 500 });
  }
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
