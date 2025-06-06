'use client';

import { MainLogoText } from '@/components/MainLogo';
import { Separator } from '@/components/ui/Separator';
import { Nav } from '@/components/NavBar';
import routes from '@/lib/config/routes';
import { Button } from '@/components/ui/Button';
import { setAuthenticated } from '@/lib/utils/auth';
import { useRouter } from 'next/navigation';

export default function HeaderUser() {
  const router = useRouter();

  const signOut = async () => {
    setAuthenticated(false);
    router.push(routes.redirects.auth.toLogin);
  };

  return (
    <div>
      <header className="p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <MainLogoText href={routes.redirects.user.toUserDashboard} />
          <Nav items={routes.routes_user} />
          <Button onClick={signOut} variant="secondary">
            Logout
          </Button>
        </div>
        <Separator />
      </header>
    </div>
  );
}
