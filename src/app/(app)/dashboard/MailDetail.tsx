'use client';

import { useState, useEffect } from 'react';
import MailClientDetail from './mail/[id]/MailClientDetail';
import { AttachmentsList } from './mail/[id]/AttachmentsList';
import axios from 'axios';
import { cleanEmailText } from '@/lib/utils/textEditors';

interface Props {
  mailId: string;
}

export function MailDetail({ mailId }: Props) {
  const [mail, setMail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMail = async () => {
      setLoading(true); // Reset loading state when mailId changes
      try {
        const response = await axios.get(`/api/mails/${mailId}`);
        setMail(response.data);
      } catch (error) {
        console.error('Error fetching mail:', error);
        setMail(null); // Reset mail state on error
      } finally {
        setLoading(false);
      }
    };

    fetchMail();
  }, [mailId]); // Add mailId to dependency array

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!mail) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Failed to load mail
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="px-6 py-1 border-b">
        <h2 className="text-base font-bold mb-1">{mail.subject || '(No subject)'}</h2>
        <p className="text-xs text-gray-500 mb-2">{new Date(mail.date).toLocaleString()}</p>
        <p className="mb-1">
          <strong>From:</strong> <span className="text-xs">{mail.from}</span>
        </p>
        <p className="">
          <strong>To:</strong> <span className="text-xs">{mail.to}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none text-sm">
          <div className="whitespace-pre-wrap break-words break-all">
            {cleanEmailText(mail.text)}
          </div>
        </div>

        {mail.attachments && mail.attachments.length > 0 && (
          <div className="mt-4">
            <AttachmentsList attachments={mail.attachments} mailId={mailId} title="Attachments" />
          </div>
        )}
      </div>

      <div className="border-t p-6">
        <MailClientDetail
          id={mailId}
          status={mail.status}
          excelFiles={mail.excelFiles || []}
          response={mail.response}
        />
      </div>
    </div>
  );
}
