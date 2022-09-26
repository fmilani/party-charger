import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";

const PartyAttendee: NextPage = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id, attendee } = router.query;
  const partyAttendeeUrl = `/api/party/${id}/${attendee}`;
  const { data, error, mutate } = useSWR(
    id && attendee ? partyAttendeeUrl : null,
    (...args) => fetch(...args).then((res) => res.json())
  );
  if (error) return <div>ERROR! =(</div>;
  if (!data) return <div>Loading...</div>;
  const { partyName, attendeeName, expenses } = data;
  const updateExpense = async (expense: any) => {
    return await (
      await fetch(partyAttendeeUrl, {
        method: "POST",
        body: JSON.stringify({ expense }),
      })
    ).json();
  };
  return (
    <div className="px-4 md:container md:mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">{partyName}</h1>
      <h3 className="text-xl font-bold">{`${attendeeName}, diz aí o que você vai dividir!`}</h3>
      <h3 className="text-lg mb-8">Depois de responder, pode fechar o site.</h3>
      <div className="grid grid-cols-1 gap-4 justify-center">
        {expenses.map((expense: any) => (
          <button
            key={expense.description}
            className={`flex gap-1 text-xl border ${
              expense.share ? "bg-indigo-500" : "border-indigo-500"
            } p-6 rounded-lg`}
            onClick={async () => {
              setOpen(false);
              const optimisticUpdatedExpense = {
                ...expense,
                share: !expense.share,
              };
              const optimisticData = {
                ...data,
                expenses: expenses.map((e: any) => {
                  if (e.description === expense.description) {
                    return optimisticUpdatedExpense;
                  } else {
                    return e;
                  }
                }),
              };
              await mutate(updateExpense(expense.description), {
                optimisticData,
                rollbackOnError: true,
                populateCache: true,
                revalidate: false,
              });
              setOpen(true);
            }}
          >
            <span>{expense.share ? "✅" : "❌"}</span>
            <span className="whitespace-nowrap truncate">
              {expense.description}
            </span>
          </button>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => router.back()}
          className="m-auto border border-indigo-500 px-16 py-4 rounded-lg flex-none"
        >
          Voltar
        </button>
      </div>
      <Toast.Provider swipeDirection={"right"} duration={2000}>
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="rounded-lg bg-slate-900/75 text-white py-4 px-8 grid align-center"
        >
          <Toast.Title>Tá salvo!</Toast.Title>
          <Toast.Description>Valeu pela resposta.</Toast.Description>
          <Toast.Close />
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-1/2 translate-x-1/2 flex flex-col p-4 w-64 m-0 " />
      </Toast.Provider>
    </div>
  );
};

export default PartyAttendee;
