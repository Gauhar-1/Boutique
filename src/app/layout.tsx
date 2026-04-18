import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import PageLoader from '@/components/PageLoader';
import Navbar from '@/components/Navbar';
import { StoreProvider } from '@/context/StoreContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Aura | Premium 3D E-commerce',
  description: 'Experience the future of shopping with our immersive 3D lifestyle platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <StoreProvider>
          <PageLoader />
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
