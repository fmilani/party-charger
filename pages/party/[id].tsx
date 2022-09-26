import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { useCombobox } from "downshift";
import useSWR, { SWRConfig } from "swr";

function getFriendsFilter(inputValue: any) {
  return function friendsFilter(friend: any) {
    return (
      !inputValue ||
      friend.first_name.toLowerCase().includes(inputValue) ||
      friend.email.toLowerCase().includes(inputValue)
    );
  };
}

function ComboBox({
  friends,
  attendees,
  onSelect,
  selectedItem,
}: {
  friends: any;
  attendees: any;
  onSelect: any;
  selectedItem: any;
}) {
  const [items, setItems] = useState(friends);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      if (!inputValue) onSelect({ first_name: "", email: "" });
      setItems(
        friends
          .filter(
            (f: any) => !attendees.map((a: any) => a.email).includes(f.email)
          )
          .filter(getFriendsFilter(inputValue))
      );
    },
    onSelectedItemChange({ selectedItem }) {
      onSelect(selectedItem);
    },
    selectedItem,
    items,
    itemToString(item) {
      return item ? item.email : "";
    },
  });

  return (
    <div className="block flex-1">
      <div id="combobox-input-wrapper" className="flex flex-col gap-1">
        <div
          className="flex shadow-sm bg-white gap-0.5"
          {...getComboboxProps()}
        >
          <input
            placeholder="Nome ou email"
            type="text"
            className="w-full p-1.5 border-inherit rounded-lg"
            {...getInputProps()}
          />
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className="absolute bg-white shadow-md max-h-40 overflow-auto"
      >
        {isOpen &&
          items.map((item: any, index: any) => (
            <li
              className={[
                "flex",
                "flex-col",
                highlightedIndex === index && "bg-indigo-500/10 cursor-pointer",
                selectedItem === item && "font-bold",
              ].join(" ")}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.first_name}</span>
              <span className="text-sm text-gray-700">{item.email}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page: NextPage = ({ fallback }: any) => (
  <SWRConfig value={{ fallback }}>
    <Party />
  </SWRConfig>
);
const Party = () => {
  const router = useRouter();
  const [newAttendee, setNewAttendee] = useState({ first_name: "", email: "" });
  const [newExpense, setNewExpense] = useState<{
    description: string;
    value: string;
  }>({ description: "", value: "" });
  const {
    data: { party, friends },
    error,
    mutate,
  } = useSWR(
    router.query.id
      ? `https://fmilani-party-charger.builtwithdark.com/party/${router.query.id}`
      : null
  );
  if (error) return <div>ERROR =((</div>;
  return (
    <div className="md:container md:mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">{party.name}</h1>
      <h3 className="text-2xl font-bold">Quem confirmou presença</h3>
      <p className="text-md font-bold mb-2">
        ({party.attendees.length} pessoas)
      </p>
      <div className="flex gap-4 overflow-auto">
        {party.attendees.map((attendee: any) => (
          <div
            key={attendee.email}
            className={`flex-shrink-0 w-24 p-2 border rounded-lg `}
          >
            <h5 className="text-center truncate">{`${attendee.first_name} ${
              attendee.last_name || ""
            }`}</h5>
            <Image
              src={attendee.photo}
              width={96}
              height={96}
              alt={attendee.name}
              onClick={() => {
                router.push(`${router.asPath}/${attendee.email}`);
              }}
            />
            <div className="flex gap-1">
              <span>{!attendee.answered && "⚠️"}</span>
              <span>
                {(party.expenses_created ?? true) && attendee.settled && "✅"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm mt-2">
        Legenda: ⚠️ Falta responder | ✅ Já pagou
      </div>
      <div className="mt-4">
        <p className="w-full">Bora? Coloca seu nome aqui embaixo:</p>
        <div className="flex items-center gap-2">
          <ComboBox
            friends={friends}
            attendees={party.attendees}
            selectedItem={newAttendee}
            onSelect={(selectedItem: any) => setNewAttendee(selectedItem)}
          />
          <button
            type="button"
            onClick={async () => {
              await fetch(`/api/party/${router.query.id}/attendee`, {
                method: "POST",
                body: JSON.stringify(newAttendee),
              });
              setNewAttendee({ first_name: "", email: "" });
              router.push(`${router.asPath}/${newAttendee.email}`);
            }}
            disabled={newAttendee.email === ""}
            className="disabled:bg-inherit disabled:border disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 cursor-pointer hover:bg-indigo-500/10 text-white bg-indigo-500 px-4 py-2 rounded-lg"
          >
            Bora!
          </button>
        </div>
      </div>
      <div className={router.query.host ? "visible" : "hidden"}>
        <h3 className="text-2xl font-bold mb-2 mt-8">Despesas</h3>
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
              className="mt-1 block w-full border-inherit rounded-lg"
              type="text"
            />
          </label>
          <label className="block shrink w-20">
            <span>Valor</span>
            <input
              id="newExpenseValue"
              name="newExpenseValue"
              value={newExpense?.value}
              onChange={(e) =>
                setNewExpense({ ...newExpense, value: e.target.value })
              }
              type="number"
              className="mt-1 block w-full border-inherit rounded-lg"
            />
          </label>
          <button
            type="button"
            onClick={async () => {
              await fetch(`/api/party/${router.query.id}/expense`, {
                method: "POST",
                body: JSON.stringify(newExpense),
              });
              setNewExpense({ description: "", value: "" });
              mutate({
                friends,
                party: { ...party, expenses: [newExpense, ...party.expenses] },
              });
            }}
            disabled={!newExpense.description || !newExpense.value}
            className="disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 cursor-pointer hover:bg-indigo-500/10 border border-indigo-500 px-4 py-2 rounded-lg"
          >
            Adicionar
          </button>
        </div>
      </div>
      <h3 className="text-2xl font-bold mt-8">Quanto custou</h3>
      <p className="text-md font-bold mb-2">
        (
        {`${party.expenses.reduce(
          (acc: number, cur: { value: string }) => acc + Number(cur.value),
          0
        )} no total`}
        )
      </p>
      <ul className="border rounded-lg p-1 max-w-sm">
        {party.expenses.map((expense: any) => (
          <li key={expense.description} className="flex justify-between">
            <span className="truncate">{expense.description}</span>
            <span>{expense.value}</span>
          </li>
        ))}
      </ul>
      <div className="text-center py-4">
        <button
          onClick={async () => {
            fetch(`/api/party/${router.query.id}/charge`, { method: "POST" });
          }}
          className="m-auto text-white bg-indigo-500 disabled:bg-gray-200 px-16 py-4 rounded-lg flex-none"
          disabled={!router.query.host}
        >
          Fazer as contas
        </button>
      </div>
    </div>
  );
};
export default Page;

export async function getServerSideProps({ query }: { query: any }) {
  const endpoint = `https://fmilani-party-charger.builtwithdark.com/party/${query.id}`;
  const { party, friends } = await fetcher(endpoint);
  return {
    props: { fallback: { [endpoint]: { party, friends } } },
  };
}
