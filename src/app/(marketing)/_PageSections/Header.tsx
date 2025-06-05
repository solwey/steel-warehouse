import { buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils/helpers';
import { Nav } from '../../../components/NavBar';
import routes from '@/lib/config/routes';
import { MainLogoText } from '@/components/MainLogo';
import { ThemeDropDownMenu } from '../../../components/ThemeDropdown';

export const Header = () => {
  return (
    <header>
      <div className="flex items-center justify-between p-6">
        <MainLogoText />
        <div className="flex justify-center items-center">
          <ThemeDropDownMenu />
          <nav>
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-6')}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
