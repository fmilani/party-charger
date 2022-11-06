export default async function Head({ params }: any) {
  const { party } = await fetch(
    `https://fmilani-party-charger.builtwithdark.com/party/${params.id}`
  ).then((r) => r.json());
  return (
    <>
      <title>{party.name}</title>
    </>
  );
}
