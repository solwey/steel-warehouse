'use client';

import { MainLogoText } from '@/components/MainLogo';
import { Separator } from '@/components/ui/Separator';
import { Nav } from '@/components/NavBar';
import routes from '@/lib/config/routes';
import { Button } from '@/components/ui/Button';

export default function HeaderUser() {
  const signOut = async () => {};

  return (
    <div>
      <header className="p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <MainLogoText href="/user/dashboard" />
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
