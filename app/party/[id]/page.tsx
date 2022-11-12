import Image from 'next/image';
import FriendsCombo from '../../../components/FriendsCombo';
import Link from 'next/link';
import NewExpense from '../../../components/NewExpense';
import ChargeButton from '../../../components/ChargeButton';

export default async function PartyPage({ params }: any) {
  const { friends, party } = await getData(params.id);
  return (
    <>
      <div className="my-12">
        <h1 className="text-3xl font-bold">{party.name}</h1>
        {party.expenses_created && (
          <div className="mt-2 bg-slate-100">
            <p>As contas foram feitas!</p>
            <p>
              <a
                className="underline"
                href={`https://secure.splitwise.com/#/groups/${party.group_id}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Acesse o Splitwise
              </a>{' '}
              para quitar sua dívida.
            </p>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-1">Presenças confirmadas!</h3>
      <p className="uppercase text-xs font-bold text-gray-700/[.54] mb-6">
        Total: {party.attendees.length} pessoas
      </p>
      <div className="flex gap-4 overflow-auto">
        {party.attendees.map((attendee: any) => (
          <Link
            href={`/party/${params.id}/${attendee.email}`}
            key={attendee.email}
          >
            <div
              className={`w-36 p-4 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 drop-shadow-sm`}
            >
              <Image
                src={attendee.photo}
                width={72}
                height={72}
                alt={`Foto de perfil de ${attendee.first_name}`}
                className="rounded-lg"
              />
              <p className="truncate font-bold mt-3">{`${attendee.first_name} ${
                attendee.last_name || ''
              }`}</p>
              <div className="flex flex-col gap-1">
                <p className="uppercase text-[0.625rem] text-gray-700/[.54] font-extrabold mt-4">
                  {!attendee.answered ? (
                    <span className="text-rose-600">Não respondeu</span>
                  ) : !party.expenses_created ? (
                    <span>Já respondeu</span>
                  ) : attendee.settled ? (
                    <span className="text-cyan-700">Já pagou</span>
                  ) : (
                    <span className="text-rose-600">Ainda não pagou</span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <FriendsCombo
          friends={friends}
          attendees={party.attendees}
          partyId={params.id}
        />
      </div>
      <div className="mt-12">
        <NewExpense partyId={params.id} />
      </div>
      <h3 className="text-2xl font-bold mb-1">Quanto custou?</h3>
      {party.expenses.length > 0 ? (
        <>
          {' '}
          <p className="uppercase text-xs font-bold text-gray-700/[.54] mb-6">
            Total: R${' '}
            {party.expenses
              .reduce(
                (acc: number, cur: { value: string }) =>
                  acc + Number(cur.value),
                0
              )
              .toFixed(2)
              .replace('.', ',')}
          </p>
          <ul className="bg-white drop-shadow-sm rounded-2xl divide-y">
            {party.expenses.map((expense: any) => (
              <li key={expense.description} className="p-4">
                <div className="font-bold flex justify-between">
                  <span className="truncate">{expense.description}</span>
                  <span>
                    R$ {Number(expense.value).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm">
                  <span className="uppercase text-xs text-gray-700/[.54]">
                    {
                      Object.values(expense.attendees).filter((v) => v === true)
                        .length
                    }
                    {party.expenses_created ? ' dividiram' : ' dividindo'}
                  </span>
                  <span>
                    R${' '}
                    {(
                      Math.floor(
                        (100 * Number(expense.value)) /
                          Object.values(expense.attendees).filter(
                            (v) => v === true
                          ).length
                      ) / 100
                    )
                      .toFixed(2)
                      .replace('.', ',')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Sem despesas ainda</p>
      )}
      <div className="text-center py-4">
        <ChargeButton partyId={params.id} />
      </div>
    </>
  );
}

async function getData(id: string) {
  const endpoint = `https://fmilani-party-charger.builtwithdark.com/party/${id}`;
  const { party, friends } = await fetch(endpoint, {
    next: { revalidate: 60 },
  }).then((res) => res.json());
  return { party, friends };
}
