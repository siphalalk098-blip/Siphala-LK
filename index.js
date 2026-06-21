import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
const PHONE_NUMBER_ID = Deno.env.get("PHONE_NUMBER_ID");
const VERIFY_TOKEN = Deno.env.get("VERIFY_TOKEN");

serve(async (req) => {
  const url = new URL(req.url);
  
  if (req.method === "GET" && url.pathname === "/webhook") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method === "POST" && url.pathname === "/webhook") {
    const body = await req.json();
    console.log(JSON.stringify(body, null, 2));
    return new Response("OK", { status: 200 });
  }

  return new Response("Bot is running!", { status: 200 });
});
