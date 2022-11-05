'use client';

import { useSearchParams } from 'next/navigation';

export default function ChargeButton({ partyId }: any) {
  const searchParams = useSearchParams();
  const isHost = Boolean(searchParams.get('host'));
  return isHost ? (
    <button
      onClick={async () => {
        fetch(`/api/party/${partyId}/charge`, { method: 'POST' });
      }}
      className="m-auto text-white bg-indigo-500 disabled:bg-gray-200 px-16 py-4 rounded-lg flex-none"
    >
      Fazer as contas
    </button>
  ) : null;
}
