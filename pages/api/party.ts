import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const r = await fetch(
    "https://fmilani-party-charger.builtwithdark.com/party",
    {
      method: "POST",
      body: req.body,
    }
  );
  const partyId = await r.json();
  res.status(200).json({ id: partyId });
}
