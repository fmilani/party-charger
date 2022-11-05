'use client';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PartyPage() {
  const [name, setName] = useState('');
  const [splitwiseApiKey, setSplitwiseApiKey] = useState('');
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Party Charger</title>
        <meta
          name="description"
          content="Easily charge your friends when you pay for the party"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold text-center my-8">
        {name || 'Criar Festa'}
      </h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!name || !splitwiseApiKey) return;
          const response = await fetch('/api/party', {
            method: 'POST',
            body: JSON.stringify({
              name,
              splitwiseApiKey,
            }),
          });
          const { id } = await response.json();
          router.push(`/party/${id}`);
        }}
      >
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span>Nome da Festa</span>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg"
              type="text"
            />
          </label>
          <label className="block">
            <span>Api Key do Splitwise</span>
            <input
              id="splitwiseApiKey"
              name="splitwiseApiKey"
              value={splitwiseApiKey}
              onChange={(e) => setSplitwiseApiKey(e.target.value)}
              className="mt-1 block w-full rounded-lg"
              type="text"
            />
            <span className="text-sm text-slate-700">
              Você pode obter sua chave{' '}
              <a
                className="underline"
                href="https://secure.splitwise.com/apps"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                nesse link
              </a>
            </span>
          </label>
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-teal-500 to-rose-600 w-full py-4 rounded-lg"
          >
            Partiu chamar a galera!
          </button>
        </div>
      </form>
    </div>
  );
}
