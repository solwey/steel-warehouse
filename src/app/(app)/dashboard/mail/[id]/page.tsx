import fs from 'fs/promises';
import path from 'path';
import { simpleParser } from 'mailparser';
import { notFound } from 'next/navigation';
import { PiMicrosoftExcelLogoLight, PiMicrosoftWordLogoLight } from 'react-icons/pi';
import { GoFileZip } from 'react-icons/go';
import { FaRegFile } from 'react-icons/fa';

interface Props {
  params: { id: string };
}

function cleanEmailText(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, idx, arr) => {
      const isEmpty = line.trim() === '';
      const isPrevEmpty = idx > 0 && arr[idx - 1].trim() === '';
      return !isEmpty || !isPrevEmpty;
    })
    .join('\n');
}

function getFileTypeIcon(extension: string) {
  switch (extension.toLowerCase()) {
    case 'doc':
    case 'docx':
      return <PiMicrosoftWordLogoLight />;
    case 'xls':
    case 'xlsx':
      return <PiMicrosoftExcelLogoLight />;
    case 'zip':
    case 'rar':
      return <GoFileZip />;
    default:
      return <FaRegFile />;
  }
}

export default async function MailDetailPage({ params }: Props) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), 'public/mock-data/income-mails', `${id}.eml`);
  const attachmentsDir = path.join(process.cwd(), 'public/eml-attachments', id);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const mail = await simpleParser(content);

    if (mail.attachments.length > 0) {
      await fs.mkdir(attachmentsDir, { recursive: true });

      for (const attachment of mail.attachments) {
        if (!attachment.filename) continue;

        const fileBuffer = attachment.content;
        const filePath = path.join(attachmentsDir, attachment.filename);
        await fs.writeFile(filePath, fileBuffer);
      }
    }

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
        <div className="border-t pt-4 mt-4 whitespace-pre-wrap">
          {cleanEmailText(mail.text ?? '[No content]')}
        </div>
        {mail.attachments.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Attachments</h2>
            <div className="flex flex-row flex-wrap gap-4">
              {mail.attachments.map((att, idx) => {
                const filename = att.filename || `file-${idx}`;
                const fileUrl = `/eml-attachments/${id}/${filename}`;
                const isImage = att.contentType.startsWith('image/');
                const extension = filename.split('.').pop() || '';
                const icon = getFileTypeIcon(extension);

                return (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center w-28 h-28 rounded-lg border border-gray-200 shadow hover:bg-gray-100 transition cursor-pointer p-2 group"
                    title={filename}
                  >
                    <div className="flex-1 flex items-center justify-center w-full">
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={filename}
                          className="object-cover w-12 h-12 rounded"
                        />
                      ) : (
                        <div className="text-4xl">{icon}</div>
                      )}
                    </div>
                    <div className="mt-2 w-full text-xs text-center truncate">{filename}</div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  } catch {
    notFound();
  }
}
