'use client';

import { EmailStatus } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRandomResponse } from '../../../../../../public/mock-data/response-examples/responses';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { AttachmentsList } from './AttachmentsList';

interface Props {
  id: string;
  status: EmailStatus;
  excelFiles: { filename: string; url: string }[];
  response?: string;
}

export default function MailClientDetail({
  id,
  status,
  excelFiles: initialExcelFiles,
  response
}: Props) {
  const router = useRouter();
  const suggestedReply = response ? response : getRandomResponse();
  const [reply, setReply] = useState(suggestedReply);
  const [loading, setLoading] = useState(false);
  const [excelFiles, setExcelFiles] = useState(initialExcelFiles);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAttachmentsChange = (newAttachments: { filename: string; url: string }[]) => {
    setExcelFiles(newAttachments);
  };

  const handleRegenerateFiles = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/mails/${id}/regenerate`);
      const response = await axios.get(`/api/mails/${id}/response-files`);
      setExcelFiles(response.data);
      router.refresh();
    } catch (error) {
      console.error('Error regenerating files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
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

      <AttachmentsList
        replyAttachments={excelFiles}
        mailId={id}
        title="Selected Excel files"
        onAttachmentsChange={handleAttachmentsChange}
        handleRegenerateFiles={handleRegenerateFiles}
        isRegenerateLoading={isLoading}
      />

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
