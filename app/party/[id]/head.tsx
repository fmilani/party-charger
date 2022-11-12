export default async function Head({ params }: any) {
  const { party } = await fetch(
    `https://fmilani-party-charger.builtwithdark.com/party/${params.id}`
  ).then((r) => r.json());
  return (
    <>
      <title>{party.name}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta
        name="description"
        content="Faça as contas da sua festa com facilidade"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://compartylhar.app" />
      <meta
        property="og:image"
        content="https://og-image.vercel.app/com**party**lhar.jpeg?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg&widths=&heights="
      />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://compartylhar.app" />
      <meta
        property="twitter:image"
        content="https://og-image.vercel.app/com**party**lhar.jpeg?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg&widths=&heights="
      />
    </>
  );
}
