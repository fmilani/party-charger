import Link from 'next/link';
import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full">
      <head />
      <body className="flex flex-col min-h-screen h-full w-full max-w-xl mx-auto px-4">
        <div className="py-2 text-lg font-bold flex items-center border-b">
          <Link href="/party">ComPARTYlhar</Link>
        </div>
        <main className="flex-1">{children}</main>
        <footer className="flex justify-center items-center border-t mt-4 p-4">
          <a
            href="https://www.github.com/fmilani"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Feito com ❤️ por fmilani
          </a>
        </footer>
      </body>
    </html>
  );
}
