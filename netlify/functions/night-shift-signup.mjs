// Night Shift text signup.
// Receives { name, phone } from the popup on the Night Shift page and adds the person to Cymbal
// as an SMS-subscribed contact. The Cymbal API key stays here on the server; it never goes
// to the browser.
//
// Netlify setup (Site configuration > Environment variables):
//   CYMBAL_API_KEY      required  your Cymbal partner API key
//   CYMBAL_AUDIENCE_ID  optional  number from the Audience tab URL in Cymbal
//   CYMBAL_TAGS         optional  comma separated, e.g. "Night Shift"  (tags must already exist in Cymbal)
//   ALLOWED_ORIGIN      optional  e.g. "https://nightshift.nightfallpresents.com"  (defaults to any origin)
//
// Once deployed, the page posts to:  https://<your-site>/api/night-shift-signup

const CYMBAL_URL = "https://api.cymbal.co/v1/partners/contact";

export default async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  const reply = (status, body) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return reply(405, { ok: false, error: "Use POST." });
  if (!process.env.CYMBAL_API_KEY) return reply(500, { ok: false, error: "Signup is not configured." });

  let body;
  try { body = await req.json(); } catch { return reply(400, { ok: false, error: "Bad request." }); }

  if (body.company) return reply(200, { ok: true });                 // hidden field filled in: a bot

  const name = String(body.name || "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (name.length < 2) return reply(400, { ok: false, error: "Enter your name." });
  const phone = String(body.phone || "").replace(/[^\d+]/g, "");
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) return reply(400, { ok: false, error: "Enter a full phone number." });

  const parts = name.split(" ");
  const contact = { phone, full_name: name, first_name: parts[0] };
  if (parts.length > 1) contact.last_name = parts.slice(1).join(" ");
  const audience = Number(process.env.CYMBAL_AUDIENCE_ID);
  if (Number.isInteger(audience) && audience > 0) contact.audience_id = audience;
  const tags = (process.env.CYMBAL_TAGS || "").split(",").map((t) => t.trim()).filter(Boolean);
  if (tags.length) contact.tags = tags;

  try {
    const res = await fetch(CYMBAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cymbal-Partner-API-Key": process.env.CYMBAL_API_KEY },
      body: JSON.stringify({ contact, opt_ins: { sms: true, email: null } }),
    });
    if (!res.ok) {
      console.error("Cymbal rejected the signup", res.status, await res.text());
      return reply(502, { ok: false, error: "Signup failed. Try again." });
    }
    return reply(200, { ok: true });
  } catch (err) {
    console.error("Could not reach Cymbal", err);
    return reply(502, { ok: false, error: "Signup failed. Try again." });
  }
};

export const config = { path: "/api/night-shift-signup" };
