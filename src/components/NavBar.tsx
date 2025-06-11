'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/Navigation';

import { MobileNav, NavProps } from '@/components/MobileNav';
import Link from 'next/link';

export const Nav = ({ items }: NavProps) => {
  const pathname = usePathname();

  return (
    <div>
      <NavigationMenu className="hidden md:inline-block">
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.link}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === item.link && 'bg-accent text-accent-foreground'
                  )}
                >
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <MobileNav items={items} />
    </div>
  );
};
