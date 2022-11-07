import Link from 'next/link';

export default function Page() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-teal-600">
          Faça as contas da sua festa com facilidade
        </span>
        <Link
          href="/party"
          className="no-underline hover:underline text-xl font-light"
        >
          Começar →
        </Link>
      </div>
    </div>
  );
}
