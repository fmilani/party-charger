import ExpenseButtons from '../../../../components/ExpenseButtons';

async function getExpensesResponse({ id, attendee }: any) {
  return await fetch(
    `https://fmilani-party-charger.builtwithdark.com/party/${id}/${attendee}`
  ).then((r) => r.json());
}

export default async function PartyAttendee({ params }: any) {
  const { id, attendee } = params;
  const data = await getExpensesResponse({ id, attendee });
  const { partyName, attendeeName, expenses } = data;

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8">{partyName}</h1>
      {expenses.length > 0 ? (
        <>
          <h3 className="text-xl font-bold">{`${attendeeName}, diz aí o que você vai dividir!`}</h3>
          <h3 className="text-sm mb-8">
            É só clicar nos items que você vai dividir.
            <br />
            Sua escolha é salva a cada clique.
          </h3>
          <div className="grid grid-cols-1 gap-4 justify-center">
            {expenses.map((expense: any) => (
              <ExpenseButtons
                key={expense.description}
                expense={expense}
                id={id}
                attendee={attendee}
              />
            ))}
          </div>
        </>
      ) : (
        <h3 className="text-xl font-bold">{`${attendeeName}, nenhuma despesa foi adicionada ainda!`}</h3>
      )}
    </>
  );
}
