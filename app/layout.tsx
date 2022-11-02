import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="flex flex-col min-h-screen">
        <main className="w-full max-w-xl mx-auto px-4 flex-1">{children}</main>
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
