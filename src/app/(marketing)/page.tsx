import config from '@/lib/config/site';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: config.seo_title,
  description: config.seo_description
};

export default function Landing() {
  return <div>Main Page</div>;
}
