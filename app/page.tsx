export default function Page() {
  return (
    <div className="h-full flex flex-col">
      <div className="text-2xl font-bold h-16 flex items-center border-b">
        party-charger
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-rose-600">
          Faça as contas da sua festa com facilidade
        </span>
        <a
          href="/party"
          target="_blank"
          className="no-underline hover:underline text-xl font-light"
        >
          Começar a festa →
        </a>
      </div>
    </div>
  );
}
