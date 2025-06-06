import Link from 'next/link';

import { NavItem } from '@/lib/types/types';

import { Icons } from '@/components/Icons';
import routes from '@/lib/config/routes';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';

export interface NavProps {
  items?: NavItem[];
}

const MobileNavItem = ({ title, link }: NavItem) => {
  const pathname = usePathname();
  const href = `${routes.redirects.dashboard.dashboardBase}${pathname.split('/')[2]}${link}`;

  return (
    <DropdownMenuItem className="flex justify-center">
      <Link className="p-4 text-xl font-semi-bold text-center" href={href}>
        {title}
      </Link>
    </DropdownMenuItem>
  );
};

export const MobileNav = ({ items }: NavProps) => {
  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.Menu size={34} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {items.map((item) => (
            <div key={item.title}>
              <MobileNavItem title={item.title} link={item.link} />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
