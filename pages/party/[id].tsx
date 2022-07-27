import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const Party: NextPage = ({ party }: any) => {
  const router = useRouter();
  console.log({ router });
  return (
    <div className="md:container md:mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">
        🥳 {party.name} 🥳
      </h1>
      <h3 className="text-2xl font-bold mb-2">Quem vai</h3>
      <div className="flex gap-4 justify-center">
        {party.attendees.map((attendee) => (
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
      <h3 className="text-2xl font-bold mb-2 mt-8">Quanto custou</h3>
      <ul>
        {party.expenses.map((expense) => (
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
          className="m-auto text-white bg-indigo-500 px-16 py-4 rounded-full flex-none"
        >
          Fazer as contas
        </button>
      </div>
    </div>
  );
};
export default Party;

export async function getServerSideProps({ query: { id } }) {
  const response = await fetch(
    `https://fmilani-party-charger.builtwithdark.com/party/${id}`,
    {
      method: "GET",
    }
  );
  const party = await response.json();
  return {
    props: { party },
  };
}
