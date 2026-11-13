import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { GET as diagGet } from "../app/api/assistant/diag/route";
import { POST as assistantPost } from "../app/api/assistant/route";
import { runAssistant, withAssistantDebug } from "../lib/assistant-engine";
import { getAssistantKb } from "../lib/assistant-kb";
import { stripCallSuggestions } from "../lib/assistant-phone";

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

function startServer(answer: string): Promise<{ url: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      await readJson(req);
      send(res, 200, {
        model: "mock",
        choices: [{ finish_reason: "stop", message: { content: answer } }],
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
  const itPartial = stripCallSuggestions(
    "Usa il modulo contatti. Puoi anche chiamarci al +39 3451234567.",
  );
  assert(itPartial === "Usa il modulo contatti.", `IT phrase not stripped: ${itPartial}`);

  const enPartial = stripCallSuggestions(
    "Use the contact form. Call us on +44 20 7946 0958.",
  );
  assert(enPartial === "Use the contact form.", `EN phrase not stripped: ${enPartial}`);

  assert(stripCallSuggestions("Chiamaci al +39 06 12345678.") === "", "IT empty expected");
  assert(stripCallSuggestions("Please phone the office.") === "", "EN phone empty");
  assert(
    stripCallSuggestions("WhatsApp va bene per domande generiche.") ===
      "WhatsApp va bene per domande generiche.",
    "WhatsApp should stay",
  );
  assert(
    stripCallSuggestions("The offering starts from £90 a month.") ===
      "The offering starts from £90 a month.",
    "offering must not match ring",
  );
  assert(
    stripCallSuggestions("da 1.100 € e 9.500 €") === "da 1.100 € e 9.500 €",
    "thousand separators must stay intact",
  );
  assert(
    stripCallSuggestions("Chiamaci al numero. Poi scrivici.") === "Poi scrivici.",
    "call sentence must still be removed",
  );

  const a6it = getAssistantKb("it").find((entry) => entry.id === "a6")?.answer ?? "";
  const a3it = getAssistantKb("it").find((entry) => entry.id === "a3")?.answer ?? "";
  const a6en = getAssistantKb("en").find((entry) => entry.id === "a6")?.answer ?? "";
  const a3en = getAssistantKb("en").find((entry) => entry.id === "a3")?.answer ?? "";
  assert(!/chiamat|telefon|videochiamat|\bcall\b|\bphone\b/i.test(a6it), "a6 IT still mentions calls");
  assert(!/chiamat|telefon|videochiamat|\bcall\b|\bphone\b/i.test(a3it), "a3 IT still mentions calls");
  assert(!/\bcall\b|\bphone\b/i.test(a6en), "a6 EN still mentions calls");
  assert(!/\bcall\b|\bphone\b/i.test(a3en), "a3 EN still mentions calls");

  const mock = await startServer("Chiamaci al +39 3451234567 per un preventivo.");
  process.env.ASSISTANT_BASE_URL = mock.url;
  process.env.ASSISTANT_API_KEY = "test-key";
  process.env.ASSISTANT_MODEL = "mock-model";
  const emptyToFaq = await runAssistant({
    message: "come faccio a iniziare?",
    pageLocale: "it",
    consumeDaily: false,
  });
  await mock.close();
  assert(emptyToFaq.type === "faq", `expected faq after empty strip, got ${emptyToFaq.type}`);
  assert(emptyToFaq.id === "a6", `expected a6, got ${emptyToFaq.id}`);
  assert(!/chiamat|\+39/i.test(emptyToFaq.answer), "FAQ fallback leaked a call");

  const prevEnv = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "production";
  const diag = await diagGet(new Request("http://localhost/api/assistant/diag?q=test"));
  assert(diag.status === 404, `diag production status ${diag.status}`);

  const debugBody = withAssistantDebug({ type: "faq", answer: "x" }, []);
  assert(!("debug" in debugBody), "debug present in production");

  const chat = await assistantPost(
    new Request("http://localhost/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.9" },
      body: JSON.stringify({ locale: "it", message: "come faccio a iniziare?" }),
    }),
  );
  const chatJson = (await chat.json()) as Record<string, unknown>;
  assert(!("debug" in chatJson), "POST debug present in production");
  process.env.VERCEL_ENV = prevEnv;

  console.log("ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
