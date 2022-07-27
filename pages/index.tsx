import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [splitwiseApiKey, setSplitwiseApiKey] = useState("");
  const [newAttendee, setNewAttendee] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newExpense, setNewExpense] = useState<{
    description: string;
    value: string;
  }>({ description: "", value: "" });
  const [expenses, setExpenses] = useState<
    { description: string; value: string }[]
  >([]);
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
                attendees,
                expenses,
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
            <div>
              <h3 className="text-xl font-bold mb-2">Convidados</h3>
              <div className="flex items-end gap-2">
                <label className="block flex-1">
                  <span>Email</span>
                  <input
                    id="newAttendee"
                    name="newAttendee"
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    type="email"
                    className="block w-full mt-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAttendees([...attendees, newAttendee]);
                    setNewAttendee("");
                  }}
                  disabled={!newAttendee}
                  className="cursor-pointer hover:bg-indigo-500/10 border border-indigo-500 px-4 py-2 rounded-full"
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {attendees.map((attendee) => (
                  <li key={attendee}>{attendee}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Despesas</h3>
              <div className="flex items-end gap-2">
                <label className="block flex-1">
                  <span>Descrição</span>
                  <input
                    id="newExpenseDescription"
                    name="newExpenseDescription"
                    value={newExpense?.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full"
                    type="text"
                  />
                </label>
                <label className="block shrink w-32">
                  <span>Valor</span>
                  <input
                    id="newExpenseValue"
                    name="newExpenseValue"
                    value={newExpense?.value}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, value: e.target.value })
                    }
                    type="number"
                    className="mt-1 block w-full"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      newExpense &&
                      newExpense.value &&
                      newExpense.description
                    ) {
                      setExpenses([...expenses, newExpense]);
                      setNewExpense({ description: "", value: "" });
                    }
                  }}
                  disabled={!newExpense.description || !newExpense.value}
                  className="cursor-pointer hover:bg-indigo-500/10 border border-indigo-500 px-4 py-2 rounded-full flex-none"
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {expenses.map((expense) => (
                  <li key={expense.description}>
                    {expense.description} - {expense.value}
                  </li>
                ))}
              </ul>
            </div>
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
