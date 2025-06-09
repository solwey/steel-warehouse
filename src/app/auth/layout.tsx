import { MainLogoText } from '@/components/MainLogo';
import { Separator } from '@/components/ui/Separator';
import { LayoutProps } from '@/lib/types/types';
import { ThemeDropDownMenu } from '../../components/ThemeDropdown';

export default async function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 mb-4">
        <div className="flex justify-between items-center">
          <MainLogoText />
          <ThemeDropDownMenu />
        </div>
        <Separator />
      </header>
      <main className="grid justify-center items-center flex-1">{children}</main>
    </div>
  );
}
