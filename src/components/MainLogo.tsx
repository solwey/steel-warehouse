import siteConfig from '@/lib/config/site';
import Link from 'next/link';
import { Icons } from '@/components/Icons';

export const MainLogoText = ({ href }: { href?: string }) => {
  const link = href ? href : '/';
  return (
    <Link href={link} className="items-center space-x-2 md:flex">
      <div>
        <Icons.Command />
        <span className="font-bold hidden md:inline-block">{siteConfig.alt_name}</span>
      </div>
    </Link>
  );
};

export const MainLogoIcon = () => {
  return (
    <Link href="/" className="w-4 h-4" legacyBehavior>
      <Icons.Command />
    </Link>
  );
};
