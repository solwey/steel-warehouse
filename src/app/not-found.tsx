'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/auth';
import routes from '@/lib/config/routes';

export default function AuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authed = isAuthenticated();

    if (!authed) {
      router.replace(routes.redirects.auth.toLogin);
    }

    if (authed) {
      router.replace(routes.redirects.user.toUserDashboard);
    }
  }, [pathname, router]);

  return null;
}
