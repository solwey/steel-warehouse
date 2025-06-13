'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, RefreshCw } from 'lucide-react';
import { MailDetail } from './MailDetail';
import axios from 'axios';
import Loading from '@/app/loading';

interface Mail {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  text: string;
  bodySnippet: string;
  status: string;
  response: string;
  attachments: Array<{
    filename: string;
    contentType: string;
  }>;
}

export default function UserDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'outlook'>('grid');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchMails = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/mails');
      setMails(response.data);
    } catch (error) {
      console.error('Error fetching mails:', error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleMailSelect = (mailId: string) => {
    setSelectedMailId(mailId);
  };

  if (loading) {
    return <Loading />;
  }

  if (isInitialLoad) {
    return (
      <div className="px-6 h-full flex flex-col w-[100vw] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">E-mail Requests</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="icon"
              className="h-9 w-9 rounded-lg"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'outlook' ? 'default' : 'outline'}
              onClick={() => setViewMode('outlook')}
              size="icon"
              className="h-9 w-9 rounded-lg"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-lg mb-4">No outstanding requests</p>
          <Button onClick={fetchMails} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Fetch Latest Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 h-screen flex flex-col w-[100vw] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">E-mail Requests</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            size="icon"
            className="h-9 w-9 rounded-lg"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'outlook' ? 'default' : 'outline'}
            onClick={() => setViewMode('outlook')}
            size="icon"
            className="h-9 w-9 rounded-lg"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {mails.map((mail) => (
            <Link
              href={`/dashboard/mail/${mail.id}`}
              key={mail.id}
              className="relative block border p-4 rounded-md shadow hover:shadow-md transition"
            >
              <div>
                <span
                  className={`
                  absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded
                  ${
                    mail.status === 'PROCESSED'
                      ? 'bg-blue-100 text-blue-800'
                      : mail.status === 'UNREADED'
                        ? 'bg-gray-100 text-gray-800'
                        : mail.status === 'READED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                  }
                `}
                >
                  {mail.status}
                </span>
                <p className="text-sm text-gray-500">{new Date(mail.date).toLocaleString()}</p>
                <h2 className="font-semibold">{mail.subject || '(No subject)'}</h2>
                <p className="text-sm">
                  <strong>From:</strong> {mail.from} <br />
                  <strong>To:</strong> {mail.to}
                </p>
                <p className="mt-2 text-gray-700 text-sm">{mail.bodySnippet}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 gap-4 h-[calc(100vh-8rem)]">
          <div className="w-1/3 border rounded-lg overflow-y-auto">
            {mails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleMailSelect(mail.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedMailId === mail.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`
                    text-xs font-semibold px-2 py-1 rounded
                    ${
                      mail.status === 'PROCESSED'
                        ? 'bg-blue-100 text-blue-800'
                        : mail.status === 'UNREADED'
                          ? 'bg-gray-100 text-gray-800'
                          : mail.status === 'READED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }
                  `}
                  >
                    {mail.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(mail.date).toLocaleString()}
                  </span>
                </div>
                <h3 className="font-semibold mt-2">{mail.subject || '(No subject)'}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>From:</strong> {mail.from}
                </p>
                <p className="text-sm text-gray-600 mt-1 truncate">{mail.bodySnippet}</p>
              </div>
            ))}
          </div>

          <div className="w-2/3 border rounded-lg overflow-y-auto">
            {selectedMailId ? (
              <MailDetail mailId={selectedMailId} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a mail to view its content
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
