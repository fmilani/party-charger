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
  onSelect,
  selectedItem,
}: {
  friends: any;
  onSelect: any;
  selectedItem: any;
}) {
  const [items, setItems] = useState(friends);
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      if (!inputValue) onSelect({ first_name: "", email: "" });
      setItems(friends.filter(getFriendsFilter(inputValue)));
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
        <label className="w-fit" {...getLabelProps()}>
          E aí, bora? Procura seu nome na lista
        </label>
        <div
          className="flex shadow-sm bg-white gap-0.5"
          {...getComboboxProps()}
        >
          <input type="text" className="w-full p-1.5" {...getInputProps()} />
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
    <div className="md:container md:mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">
        🥳 {party.name} 🥳
      </h1>
      <h3 className="text-2xl font-bold mb-2">Quem vai até agora</h3>
      <div className="flex gap-4 justify-center">
        {party.attendees.map((attendee: any) => (
          <div key={attendee.email}>
            <h5 className="text-center">{`${attendee.first_name} ${
              attendee.last_name || ""
            }`}</h5>
            <Image
              src={attendee.photo}
              width={200}
              height={200}
              alt={attendee.name}
              onClick={() => {
                router.push(`${router.asPath}/${attendee.email}`);
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-end gap-2">
          <ComboBox
            friends={friends}
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
            className="disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 cursor-pointer hover:bg-indigo-500/10 border border-indigo-500 px-4 py-2 rounded-full"
          >
            Partiu festa!
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
            className="disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 cursor-pointer hover:bg-indigo-500/10 border border-indigo-500 px-4 py-2 rounded-full"
          >
            Adicionar
          </button>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2 mt-8">Quanto custou</h3>
      <h4 className="text-xl font-bold mb-4">
        Total: {party.expenses.reduce((acc, cur) => acc + Number(cur.value), 0)}
      </h4>
      <ul>
        {party.expenses.map((expense: any) => (
          <li key={expense.description}>
            {expense.description} - {expense.value}
          </li>
        ))}
      </ul>
      <div className="text-center">
        <button
          onClick={async () => {
            fetch(`/api/party/${router.query.id}/charge`, { method: "POST" });
          }}
          className="m-auto text-white bg-indigo-500 disabled:bg-gray-200 px-16 py-4 rounded-full flex-none"
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
