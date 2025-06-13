'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import MailClientDetail from './MailClientDetail';
import EmailTextSection from './EmailTextSection';
import { AttachmentsList } from './AttachmentsList';
import axios from 'axios';
import { cleanEmailText } from '@/lib/utils/textEditors';
import Loading from '@/app/loading';

interface Props {
  params: Promise<{ id: string }>;
}

export default function MailDetailPage({ params }: Props) {
  const { id } = use(params);
  const [mail, setMail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/mails/${id}`);
        setMail(response.data);
      } catch (error) {
        console.error('Error fetching mail:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchMail();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!mail) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold mb-2">{mail.subject || '(No subject)'}</h1>
      <p className="text-sm text-gray-500 mb-4">{new Date(mail.date).toLocaleString()}</p>
      <p className="mb-2">
        <strong>From:</strong> {mail.from || 'Unknown'}
      </p>
      <p className="mb-2">
        <strong>To:</strong> {mail.to || 'Unknown'}
      </p>
      <div className="border-t pt-4 mt-4">
        <EmailTextSection text={cleanEmailText(mail.text || '[No content]')} />
      </div>
      {mail.attachments && mail.attachments.length > 0 && (
        <AttachmentsList attachments={mail.attachments} mailId={id} />
      )}

      <div className="border-t pt-4 mt-4">
        <h1 className="text-xl font-bold mb-2">Suggested reply:</h1>
        <MailClientDetail
          id={id}
          status={mail.status}
          excelFiles={mail.excelFiles || []}
          response={mail.response}
        />
      </div>
    </div>
  );
}
