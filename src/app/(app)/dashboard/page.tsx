import { loadEmlMessages } from '@/lib/utils/loadEmlMessages';
import Link from 'next/link';

export default async function UserDashboard() {
  const mails = await loadEmlMessages();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mails</h1>
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
    </div>
  );
}
