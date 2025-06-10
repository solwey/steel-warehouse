import '../styles/globals.css';
import { InterFont } from '@/styles/fonts';
import { ThemeProvider } from '@/styles/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';
import config from '@/lib/config/site';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const RootLayout = ({ children }) => {
  return (
    <html suppressHydrationWarning lang="en" className={`${InterFont.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color={config.loading_bar_color} />
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
};

export default RootLayout;
