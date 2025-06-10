import fs from 'fs/promises';
import path from 'path';
import { simpleParser, ParsedMail as MailParserParsedMail, AddressObject } from 'mailparser';
import { EmailStatus, IncomingEmail } from '@prisma/client';
import axios from 'axios';

export interface ParsedMailAttachment {
  filename: string;
  contentType: string;
  url: string;
}

export interface ParsedMail {
  id: string;
  from: string;
  to: string;
  date: string;
  subject: string;
  bodySnippet: string;
  status?: EmailStatus;
  attachments?: ParsedMailAttachment[];
}

function extractAddress(field?: AddressObject | string | null): string {
  if (!field) return 'Unknown';

  if (typeof field === 'string') return field;

  if (Array.isArray(field.value)) {
    return field.value.map((v) => v.address || v.name || '').join(', ');
  }

  return field.text || 'Unknown';
}

export async function loadEmlMessages(): Promise<ParsedMail[]> {
  const dirPath = path.join(process.cwd(), 'public/mock-data/income-mails');
  const files = await fs.readdir(dirPath);
  const emlFiles = files.filter((f) => f.endsWith('.eml'));

  const parsedMails: ParsedMail[] = [];

  for (const file of emlFiles) {
    const content = await fs.readFile(path.join(dirPath, file), 'utf-8');

    try {
      const parsed: MailParserParsedMail = await simpleParser(content);

      const id = file.replace('.eml', '');

      const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
      let email: IncomingEmail | null = null;
      try {
        const response = await axios.get(`${baseUrl}/api/mails/${id}`);
        email = response.data;
      } catch {
        try {
          const createResponse = await axios.post(`${baseUrl}/api/mails`, {
            id: id,
            subject: parsed.subject || '',
            sender: extractAddress(parsed.from),
            body: parsed.text || '',
            status: EmailStatus.UNREADED
          });

          email = createResponse.data;
        } catch (createErr: any) {
          if (createErr.response) {
            console.error(`Failed to create email for ${id}:`, createErr.response.data);
          } else {
            console.error(`Failed to create email for ${id}`, createErr);
          }
        }
      }

      parsedMails.push({
        id: id,
        from: extractAddress(parsed.from),
        to: extractAddress(parsed.to),
        date: parsed.date ? parsed.date.toISOString() : '',
        subject: parsed.subject || '',
        bodySnippet: (parsed.text || '').slice(0, 200) + '...',
        status: email?.status || EmailStatus.UNREADED
      });
    } catch (e) {
      console.error(`Failed to parse ${file}`, e);
    }
  }

  return parsedMails;
}
