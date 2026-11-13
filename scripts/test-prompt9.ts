import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import {
  buildFallbackDraft,
  extractJsonObject,
  parseDraftPayload,
  stripPersonalData,
} from "../lib/assistant-draft";
import { POST as assistantPost } from "../app/api/assistant/route";
import { runAssistantDraft } from "../lib/assistant-engine";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function send(res: ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk as Buffer));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function startServer(content: string): Promise<{ url: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      await readJson(req);
      send(res, 200, {
        model: "mock",
        choices: [{ finish_reason: "stop", message: { content } }],
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("no port");
      resolve({
        url: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}

async function main() {
  const mixed =
    "Scrivetemi a mario.rossi@example.com o +39 345 1234567, sito https://example.com e IBAN IT60X0542811101000000123456.";
  const cleaned = stripPersonalData(mixed);
  assert(!cleaned.includes("@"), `email left: ${cleaned}`);
  assert(!/\+39/.test(cleaned), `phone left: ${cleaned}`);
  assert(!/https?:/i.test(cleaned), `url left: ${cleaned}`);
  assert(!/IBAN|IT60/i.test(cleaned), `iban left: ${cleaned}`);

  const uk = stripPersonalData("Call +44 20 7946 0958 or 07700 900123");
  assert(!/\+44/.test(uk) && !/07700/.test(uk), `UK phone left: ${uk}`);

  assert(
    stripPersonalData("Un sito da 1.100 € va bene.") === "Un sito da 1.100 € va bene.",
    "euro price stripped",
  );

  const parsed = parseDraftPayload({
    topic: "web",
    message: "Vorrei un sito. Email bob@x.com",
  });
  assert(parsed?.topic === "web", "topic web");
  assert(parsed !== null && !parsed.message.includes("@"), "draft email not stripped");

  assert(parseDraftPayload({ topic: "spaceship", message: "Ciao" })?.topic === "other", "bad topic");
  assert(parseDraftPayload({ topic: "web", message: "" }) === null, "empty message");
  assert(extractJsonObject('note {"topic":"mobile","message":"ok"} extra') !== null, "extract json");

  const fallback = buildFallbackDraft("it", [
    { role: "user", content: "ho un ristorante a Palermo e vorrei prenotazioni" },
    { role: "assistant", content: "Hai già un sito?" },
    { role: "user", content: "no, scrivetemi a x@y.com" },
  ]);
  assert(fallback.topic === "web", `fallback topic ${fallback.topic}`);
  assert(fallback.message.includes("1.100"), "fallback missing IT price");
  assert(!fallback.message.includes("@"), "fallback leaked email");

  const prev = {
    base: process.env.ASSISTANT_BASE_URL,
    key: process.env.ASSISTANT_API_KEY,
    model: process.env.ASSISTANT_MODEL,
  };

  const bad = await startServer("this is not json at all");
  process.env.ASSISTANT_BASE_URL = bad.url;
  process.env.ASSISTANT_API_KEY = "test-key";
  process.env.ASSISTANT_MODEL = "mock-model";
  const fromBad = await runAssistantDraft({
    pageLocale: "en",
    history: [
      { role: "user", content: "I need an app for iPhone" },
      { role: "assistant", content: "Do you already have a site?" },
    ],
    consumeDaily: false,
  });
  await bad.close();
  assert(fromBad.source === "fallback", `expected fallback, got ${fromBad.source}`);
  assert(fromBad.topic === "mobile", `expected mobile, got ${fromBad.topic}`);
  assert(fromBad.message.includes("£6,500"), fromBad.message);

  const good = await startServer(
    '{"topic":"ecommerce","message":"I run a shop and need an online store from the listed starting price."}',
  );
  process.env.ASSISTANT_BASE_URL = good.url;
  const fromGood = await runAssistantDraft({
    pageLocale: "en",
    history: [{ role: "user", content: "online shop please" }],
    consumeDaily: false,
  });
  await good.close();
  assert(fromGood.source === "ai", `expected ai, got ${fromGood.source}`);
  assert(fromGood.topic === "ecommerce", fromGood.topic);

  const noLlm = await runAssistantDraft({
    pageLocale: "it",
    history: [{ role: "user", content: "vorrei un sito vetrina" }],
    consumeDaily: false,
  });
  // env still set from good.url which is closed → network fallback
  assert(noLlm.topic === "web" || noLlm.source === "fallback", "closed server should fallback");

  delete process.env.ASSISTANT_BASE_URL;
  delete process.env.ASSISTANT_API_KEY;
  delete process.env.ASSISTANT_MODEL;
  const offline = await runAssistantDraft({
    pageLocale: "it",
    history: [{ role: "user", content: "vorrei un sito vetrina" }],
    consumeDaily: false,
  });
  assert(offline.source === "fallback", "offline source");
  assert(offline.topic === "web", offline.topic);

  const post = await assistantPost(
    new Request("http://localhost/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.40" },
      body: JSON.stringify({
        locale: "it",
        mode: "draft",
        history: [{ role: "user", content: "ho un ristorante, voglio prenotazioni" }],
      }),
    }),
  );
  const body = (await post.json()) as Record<string, unknown>;
  assert(body.type === "draft", `route type ${body.type}`);
  assert(typeof body.message === "string" && String(body.message).length > 0, "route message");
  assert(!String(body.message).includes("?draft="), "draft leaked into message as query");

  if (prev.base) process.env.ASSISTANT_BASE_URL = prev.base;
  else delete process.env.ASSISTANT_BASE_URL;
  if (prev.key) process.env.ASSISTANT_API_KEY = prev.key;
  else delete process.env.ASSISTANT_API_KEY;
  if (prev.model) process.env.ASSISTANT_MODEL = prev.model;
  else delete process.env.ASSISTANT_MODEL;

  console.log("ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
