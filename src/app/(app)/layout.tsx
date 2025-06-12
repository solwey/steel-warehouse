import { LayoutProps } from '@/lib/types/types';
import HeaderUser from './_PageSections/Header';

export default async function UserLayout({ children }: LayoutProps) {
  return (
    <div>
      <HeaderUser />
      <main className="grid justify-center items-center">{children}</main>
    </div>
  );
}
