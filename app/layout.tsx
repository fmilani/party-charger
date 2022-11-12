import Link from 'next/link';
import { Nunito } from '@next/font/google';
import './globals.css';

const nunito = Nunito({
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`h-full ${nunito.className}`}>
      <head />
      <body className="flex flex-col min-h-screen h-full w-full max-w-4xl mx-auto px-4 bg-gray-100 text-gray-700/[.87]">
        <div className="mt-8 p-4 text-lg font-bold flex items-center rounded-xl drop-shadow-sm bg-white">
          <Link href="/party">
            <span className="text-2xl">
              com
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-teal-600">
                party
              </span>
              lhar
            </span>
          </Link>
        </div>
        <main className="flex-1">{children}</main>
        <footer className="flex flex-col gap-2 justify-center items-center border-t mt-4 p-4">
          <a
            href="https://www.github.com/fmilani"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Feito com ❤️ por fmilani
          </a>
          <a
            href="https://www.behance.net/cmls"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Design ✨ por cmls
          </a>
        </footer>
      </body>
    </html>
  );
}
