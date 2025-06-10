'use client';

import { EmailStatus } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiMicrosoftExcelLogoLight } from 'react-icons/pi';
import { getRandomResponse } from '../../../../../../public/mock-data/response-examples/responses';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons';

interface Props {
  id: string;
  status: EmailStatus;
  excelFiles: { filename: string; url: string }[];
  response?: string;
}

export default function MailClientDetail({ id, status, excelFiles, response }: Props) {
  const router = useRouter();
  const suggestedReply = response ?? getRandomResponse();
  const [reply, setReply] = useState(suggestedReply);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === EmailStatus.UNREADED) {
      axios
        .patch(`/api/mails/${id}`, {
          status: EmailStatus.READED
        })
        .catch((error) => {
          console.error('Error updating email status:', error);
        });
    }
  }, [id]);

  const handleSend = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/mails/${id}`, {
        status: EmailStatus.PROCESSED,
        response: reply
      });
      toast.success('Email processed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating email status:', error);
      toast.error('Failed to process email. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-3xl">
      {status === EmailStatus.PROCESSED ? (
        <p className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 whitespace-pre-line">
          {reply}
        </p>
      ) : (
        <textarea
          id="suggestedReply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Edit your reply here..."
        />
      )}

      {excelFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Selected Excel files</h3>
          <div className="flex flex-wrap gap-4">
            {excelFiles.map(({ filename, url }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center w-28 h-28 rounded-lg border border-gray-200 shadow hover:bg-gray-100 transition cursor-pointer p-2 group"
                title={filename}
              >
                <div className="flex-1 flex items-center justify-center w-full text-4xl">
                  <PiMicrosoftExcelLogoLight />
                </div>
                <div className="mt-2 w-full text-xs text-center truncate">{filename}</div>
              </a>
            ))}
          </div>
        </div>
      )}
      <Button
        disabled={loading || status === EmailStatus.PROCESSED}
        className="w-full mt-2"
        onClick={handleSend}
      >
        {loading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
        <Icons.Mail className="mr-2 h-4 w-4" />
        {loading ? 'Sending...' : status === EmailStatus.PROCESSED ? 'Already sended' : 'Send'}
      </Button>
    </div>
  );
}
