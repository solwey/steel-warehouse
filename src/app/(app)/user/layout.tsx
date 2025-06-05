import { LayoutProps } from '@/lib/types/types';
import HeaderUser from './_PageSections/Header';
import routes from '@/lib/config/routes';
import { redirect } from 'next/navigation';

export default async function UserLayout({ children }: LayoutProps) {
  // Check if the user is authenticated

  return (
    <div>
      <HeaderUser />
      <main className="grid justify-center items-center">{children}</main>
    </div>
  );
}
