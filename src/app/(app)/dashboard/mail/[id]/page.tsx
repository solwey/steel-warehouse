import fs from 'fs/promises';
import path from 'path';
import { simpleParser } from 'mailparser';
import { notFound } from 'next/navigation';
import { PiMicrosoftExcelLogoLight, PiMicrosoftWordLogoLight } from 'react-icons/pi';
import { GoFileZip } from 'react-icons/go';
import { FaRegFile } from 'react-icons/fa';
import MailClientDetail from './MailClientDetail';
import EmailTextSection from './EmailTextSection';
import { AttachmentsList } from './AttachmentsList';
import axios from 'axios';
import * as XLSX from 'xlsx';
import prisma from '@/lib/db/prisma';
import { isMatchingMaterial } from '@/lib/constants/materialMappings';

interface Props {
  params: { id: string };
}

function cleanEmailText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function MailDetailPage({ params }: Props) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), 'public/mock-data/income-mails', `${id}.eml`);
  const attachmentsDir = path.join(process.cwd(), 'public/eml-attachments', id);
  const responseDir = path.join(process.cwd(), 'public/eml-attachments', `response-${id}`);

  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
  const response = await axios.get(`${baseUrl}/api/mails/${id}`);
  const data = response.data;

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const mail = await simpleParser(content);

    const necessaryMaterials = await prisma.necessaryMaterial.findMany({
      select: {
        material: {
          select: {
            name: true,
            grade: true
          }
        }
      }
    });

    if (mail.attachments.length > 0) {
      await fs.mkdir(attachmentsDir, { recursive: true });
      await fs.mkdir(responseDir, { recursive: true });

      for (const attachment of mail.attachments) {
        if (!attachment.filename) continue;

        const fileBuffer = attachment.content;
        const filePath = path.join(attachmentsDir, attachment.filename);
        await fs.writeFile(filePath, fileBuffer);

        const extension = attachment.filename.split('.').pop()?.toLowerCase();
        if (extension === 'xlsx' || extension === 'xls') {
          try {
            const workbook = XLSX.read(fileBuffer);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (data.length > 0) {
              const headerRow = data[0];

              const possibleNameColumns = headerRow
                .map((header: string, index: number) => ({
                  index,
                  header: String(header || '').toLowerCase()
                }))
                .filter(
                  (col) =>
                    col.header.includes('name') ||
                    col.header.includes('material') ||
                    col.header.includes('type') ||
                    col.header.includes('description')
                );

              const possibleGradeColumns = headerRow
                .map((header: string, index: number) => ({
                  index,
                  header: String(header || '').toLowerCase()
                }))
                .filter(
                  (col) =>
                    col.header.includes('grade') ||
                    col.header.includes('spec') ||
                    col.header.includes('standard') ||
                    col.header.includes('class')
                );

              const allMatchingRows = data.slice(1).filter((row) => {
                const nameMatches = possibleNameColumns.some((col) => {
                  const value = String(row[col.index] || '').toLowerCase();
                  return necessaryMaterials.some(
                    (nm) => isMatchingMaterial(value, '') || isMatchingMaterial('', value)
                  );
                });

                const gradeMatches = possibleGradeColumns.some((col) => {
                  const value = String(row[col.index] || '').toLowerCase();
                  return necessaryMaterials.some(
                    (nm) => isMatchingMaterial('', value) || isMatchingMaterial(value, '')
                  );
                });

                return nameMatches || gradeMatches;
              });

              if (allMatchingRows.length > 0) {
                const numRowsToSelect = getRandomInt(5, Math.min(8, allMatchingRows.length));
                const shuffledRows = shuffleArray(allMatchingRows);
                const selectedRows = shuffledRows.slice(0, numRowsToSelect);

                const filteredData = [headerRow, ...selectedRows];

                const newWorkbook = XLSX.utils.book_new();
                const newWorksheet = XLSX.utils.aoa_to_sheet(filteredData);
                XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, firstSheetName);

                const responseFilePath = path.join(responseDir, attachment.filename);
                const newBuffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: extension });
                await fs.writeFile(responseFilePath, newBuffer);
              }
            }
          } catch (error) {
            console.error(`Error processing Excel file ${attachment.filename}:`, error);
          }
        }
      }
    }

    let excelFiles: { filename: string; url: string }[] = [];
    try {
      const files = await fs.readdir(responseDir);
      excelFiles = files
        .filter((file) => /\.(xls|xlsx)$/i.test(file))
        .map((file) => ({
          filename: file,
          url: `public/eml-attachments/response-${id}/${file}`
        }));
    } catch (error) {
      console.error('Error reading response directory:', error);
      excelFiles = [];
    }

    const serializableAttachments = mail.attachments.map((att) => ({
      filename: att.filename || '',
      contentType: att.contentType
    }));

    return (
      <div className="p-6 max-w-3xl">
        <h1 className="text-xl font-bold mb-2">{mail.subject || '(No subject)'}</h1>
        <p className="text-sm text-gray-500 mb-4">{mail.date?.toLocaleString()}</p>
        <p className="mb-2">
          <strong>From:</strong> {mail.from?.text ?? 'Unknown'}
        </p>
        <p className="mb-2">
          <strong>To:</strong> {mail.to?.text ?? 'Unknown'}
        </p>
        <div className="border-t pt-4 mt-4">
          <EmailTextSection text={cleanEmailText(mail.text ?? '[No content]')} />
        </div>
        {mail.attachments.length > 0 && (
          <AttachmentsList attachments={serializableAttachments} mailId={id} />
        )}

        <div className="border-t pt-4 mt-4">
          <h1 className="text-xl font-bold mb-2">Suggested reply:</h1>
          <MailClientDetail
            id={id}
            status={data.status}
            excelFiles={excelFiles}
            response={data.response}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
