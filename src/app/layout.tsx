import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { VaultProvider } from '@/context/vault-context';

export const metadata: Metadata = {
  title: 'CloudVault — Secure Cloud-Based File Storage and Sharing System',
  description:
    'A simple, secure, and research-oriented cloud file storage platform featuring Sensitivity-Based Access Control (SBAC). Built with Next.js, Firebase, and Tailwind CSS for B.Tech Final Year Examination.',
  keywords: [
    'CloudVault',
    'Sensitivity-Based Access Control',
    'Cloud Storage',
    'Next.js',
    'Firebase',
    'Cybersecurity',
    'B.Tech Final Year Project',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 font-sans min-h-screen">
        <AuthProvider>
          <VaultProvider>{children}</VaultProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
