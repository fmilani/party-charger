import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const PartyAttendee: NextPage = () => {
  const router = useRouter();
  const { id, attendee } = router.query;
  const { mutate } = useSWRConfig();
  const partyAttendeeUrl = `/api/party/${id}/${attendee}`;
  const { data, error } = useSWR(partyAttendeeUrl, (...args) =>
    fetch(...args).then((res) => res.json())
  );
  console.log({ data, error });
  if (error) return <div>ERROR! =(</div>;
  if (!data) return <div>Loading...</div>;
  const { partyName, attendeeName, expenses } = data;
  const updateExpense = async (expense: any) => {
    await (
      await fetch(partyAttendeeUrl, {
        method: "POST",
        body: JSON.stringify({ expense }),
      })
    ).json();
    mutate(partyAttendeeUrl);
  };
  return (
    <div className="md:container md:mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">🥳 {partyName} 🥳</h1>
      <h3 className="text-xl font-bold mb-2">{`${attendeeName}, diz aí se você vai comer carne ou beber breja`}</h3>
      <div className="flex gap-4 justify-center">
        <button
          className={`text-8xl text-white border ${
            expenses.find((e: any) => e.description === "carne").attendees[
              attendee as string
            ]
              ? "bg-indigo-500"
              : "border-indigo-500"
          } px-16 py-32 flex-none`}
          onClick={async () => updateExpense("carne")}
        >
          🥩
          {expenses.find((e: any) => e.description === "carne").attendees[
            attendee as string
          ]
            ? "✅"
            : "❌"}
        </button>
        <button
          className={`text-8xl text-white border ${
            expenses.find((e: any) => e.description === "breja").attendees[
              attendee as string
            ]
              ? "bg-indigo-500"
              : "border-indigo-500"
          } px-16 py-32 flex-none`}
          onClick={async () => updateExpense("breja")}
        >
          🍺
          {expenses.find((e: any) => e.description === "breja").attendees[
            attendee as string
          ]
            ? "✅"
            : "❌"}
        </button>
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => router.back()}
          className="m-auto border border-indigo-500 px-16 py-4 rounded-full flex-none"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default PartyAttendee;
