'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { User } from '@prisma/client';
import { toast } from 'react-toastify';
import { getUser } from '@/lib/utils/auth';
import Loading from '@/app/loading';

export default function SettingsPage() {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);

  const localUser = getUser();

  useEffect(() => {
    axios
      .get(`/api/users/${localUser.id}`)
      .then((res) => setUser(res.data))
      .catch(() => {
        toast.error('Failed to load user settings');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <p className="mb-6">
        This is the settings page where you can update your account information.
      </p>

      {loading ? (
        <Loading />
      ) : !user ? (
        <p>Failed to load user data.</p>
      ) : (
        <div className="space-y-4 border rounded-md p-4 shadow-sm bg-white dark:bg-gray-900">
          <div>
            <strong>Name:</strong> {user.name || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {user.email || 'N/A'}
          </div>
          <div>
            <strong>Display Name:</strong> {user.display_name || 'N/A'}
          </div>
          <div>
            <strong>Role:</strong> {user.access_role || 'N/A'}
          </div>
          <div>
            <strong>Password:</strong> ********{' '}
            <span className="text-sm text-gray-500">(hidden)</span>
          </div>

          <div className="pt-4">
            <Link
              href="/settings/edit"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
