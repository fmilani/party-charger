import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [splitwiseApiKey, setSplitwiseApiKey] = useState("");
  const router = useRouter();
  return (
    <div className="md:container md:mx-auto">
      <Head>
        <title>Party Charger</title>
        <meta
          name="description"
          content="Easily charge your friends when you pay for the party"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold text-center my-8">
          🥳 {name || "Criar festa"} 🥳
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch("/api/party", {
              method: "POST",
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
              <span>Nome da festa</span>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full"
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
                className="mt-1 block w-full"
                type="text"
              />
            </label>
            <button
              type="submit"
              className="m-auto text-white bg-indigo-500 px-16 py-4 rounded-full flex-none"
            >
              Criar festa!
            </button>
          </div>
        </form>
      </main>

      <footer className="flex flex-1 justify-center items-center border-t mt-4 p-2">
        <a
          href="https://www.github.com/fmilani"
          target="_blank"
          rel="noopener noreferrer"
        >
          Feito com ❤️ por fmilani
        </a>
      </footer>
    </div>
  );
};

export default Home;
