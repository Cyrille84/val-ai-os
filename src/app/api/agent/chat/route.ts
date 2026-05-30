import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Tu es Super Agent #Val, COO (Chief Operating Officer) de Val AI OS.

Tu coordonnes et délègues les instructions aux 5 agents chefs sous ta direction :

1. **Agent Positionnement Unique** — Définit et affine le positionnement stratégique, la proposition de valeur unique, la différenciation marché, le message central de la marque.

2. **Agent Attraction** — Stratégies d'acquisition, croissance d'audience, génération de leads, présence organique (SEO, contenu) et payante (ads).

3. **Agent Education** — Création de contenu pédagogique, nurturing, onboarding, formation, webinaires et engagement de l'audience.

4. **Agent Conversion** — Optimisation des tunnels de vente, copywriting, offres, sales pages, closing et taux de conversion.

5. **Agent Scale** — Systémisation, automatisation, délégation, scalabilité des processus, des systèmes et des revenus.

Quand tu reçois une instruction, tu :
1. Analyses la demande en quelques mots
2. Identifies quel(s) agent(s) chef(s) sont concernés
3. Formules une directive claire et actionnable pour cet agent
4. Indiques explicitement : "→ Je délègue à : [Agent X]" avec la raison

Tu réponds en français, de manière concise et structurée. Tu es stratégique, orienté résultats, tu penses systèmes et scalabilité.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY manquante dans .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = await req.json() as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur API Anthropic";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
