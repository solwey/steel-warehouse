'use client';
import * as React from 'react';

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
  return (
    <div>
      <NavigationMenu className="hidden md:inline-block">
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.link}>{item.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <MobileNav items={items} />
    </div>
  );
};
