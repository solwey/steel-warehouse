import fs from 'fs/promises';
import path from 'path';
import { simpleParser, ParsedMail as MailParserParsedMail, AddressObject } from 'mailparser';
import { EmailStatus } from '@prisma/client';

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

      const statuses = Object.values(EmailStatus);
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      parsedMails.push({
        id: file.replace('.eml', ''),
        from: extractAddress(parsed.from),
        to: extractAddress(parsed.to),
        date: parsed.date ? parsed.date.toISOString() : '',
        subject: parsed.subject || '',
        bodySnippet: (parsed.text || '').slice(0, 200) + '...',
        status: randomStatus
      });
    } catch (e) {
      console.error(`Failed to parse ${file}`, e);
    }
  }

  return parsedMails;
}
