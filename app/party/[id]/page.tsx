import Image from 'next/image';
import FriendsCombo from '../../../components/FriendsCombo';
import Link from 'next/link';
import NewExpense from '../../../components/NewExpense';
import ChargeButton from '../../../components/ChargeButton';

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then((res) => res.json());

export default async function PartyPage({ params }: any) {
  const { friends, party } = await getData(params.id);
  return (
    <>
      <div className="my-8 text-center">
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
      <h3 className="text-2xl font-bold mt-2">Quem confirmou presença</h3>
      <p className="text-md font-bold mb-2">
        ({party.attendees.length} pessoas)
      </p>
      <div className="flex gap-4 overflow-auto">
        {party.attendees.map((attendee: any) => (
          <Link
            href={`/party/${params.id}/${attendee.email}`}
            key={attendee.email}
          >
            <div
              className={`flex-shrink-0 w-24 p-2 border rounded-lg cursor-pointer hover:bg-gray-100`}
            >
              <h5 className="text-center truncate">{`${attendee.first_name} ${
                attendee.last_name || ''
              }`}</h5>
              <Image
                src={attendee.photo}
                width={96}
                height={96}
                alt={`Foto de perfil de ${attendee.first_name}`}
              />
              <div className="flex gap-1">
                <span>{!attendee.answered && '⚠️'}</span>
                <span>
                  {(party.expenses_created ?? true) && attendee.settled && '✅'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-sm mt-2">
        Legenda: ⚠️ Falta responder | ✅ Já pagou
      </div>
      <div className="mt-4">
        <FriendsCombo
          friends={friends}
          attendees={party.attendees}
          partyId={params.id}
        />
      </div>
      <div className="mt-4">
        <NewExpense partyId={params.id} />
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
      <ul className="border rounded-lg p-1 divide-y divide-dashed">
        {party.expenses.map((expense: any) => (
          <li key={expense.description} className="p-1">
            <div className="flex justify-between">
              <span className="truncate">{expense.description}</span>
              <span>{expense.value}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>
                {
                  Object.values(expense.attendees).filter((v) => v === true)
                    .length
                }
                {party.expenses_created ? ' dividiram' : ' dividindo'}
              </span>
              <span>
                {Math.floor(
                  (100 * Number(expense.value)) /
                    Object.values(expense.attendees).filter((v) => v === true)
                      .length
                ) / 100}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center py-4">
        <ChargeButton partyId={params.id} />
      </div>
    </>
  );
}

async function getData(id: string) {
  const endpoint = `https://fmilani-party-charger.builtwithdark.com/party/${id}`;
  const { party, friends } = await fetcher(endpoint);
  return { party, friends };
}
