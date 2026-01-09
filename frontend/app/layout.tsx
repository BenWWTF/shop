import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Shop.ZurLegende - Pullovers & Sweatshirts',
  description: 'Synthwave aesthetic pullovers and sweatshirts',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="grid-bg" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
