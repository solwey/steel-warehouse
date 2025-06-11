'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get('/api/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to fetch users');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreate = () => {
    router.push('/users/form');
  };

  const handleEdit = (userId: string) => {
    router.push(`/users/form?id=${userId}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users list:</h1>
        </div>
        <Button onClick={handleCreate}>+ Create User</Button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p>
                    <strong>Name:</strong> {user.display_name ?? user.name ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.access_role ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <Button variant="secondary" onClick={() => handleEdit(user.id)}>
                    ✏️ Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
