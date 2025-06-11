'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { NavItem } from '@/lib/types/types';

import { Icons } from '@/components/Icons';
import routes from '@/lib/config/routes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';

export interface NavProps {
  items: {
    title: string;
    link: string;
  }[];
}

const MobileNavItem = ({ title, link }: NavItem) => {
  const pathname = usePathname();
  const href = `${routes.redirects.user.toUserDashboard}${pathname.split('/')[2]}${link}`;

  return (
    <DropdownMenuItem className="flex justify-center">
      <Link className="p-4 text-xl font-semi-bold text-center" href={href} legacyBehavior>
        {title}
      </Link>
    </DropdownMenuItem>
  );
};

export function MobileNav({ items }: NavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex flex-col space-y-3">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.link}
              className={cn(
                'flex w-full items-center py-2 text-sm font-medium transition-colors hover:text-primary',
                pathname === item.link ? 'text-primary' : 'text-muted-foreground'
              )}
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
