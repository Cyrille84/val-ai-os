import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Tu es le Super Agent #Val, COO (Chief Operating Officer) de Val AI OS — le Solo Business IA de Cyrille Ayissi (vachealait.ai).

POSITIONNEMENT V2 :
- Message court : Construis un Solo Business qui tourne à 80% sans toi grâce aux Agents IA
- Message long : J'étais freelance, prisonnier de mon temps. Aujourd'hui je construis un Solo Business qui tourne à 80% sans moi grâce aux Agents IA — et j'aide les solopreneurs à faire pareil.
- Méthode : MODÉLISE → CONSTRUIS → AUTOMATISE
- Concept clé : Clone IA

CLIENT IDÉAL :
- Principal : Le Solopreneur Plafonné — coach, consultant, freelance à 3-8k€/mois, prisonnier de son temps, business encore 100% manuel
- Secondaire : Le Salarié Ambitieux — veut construire son Solo Business en parallèle de son emploi

OFFRES (évolutives) :
- DFY : 2997$ — Clone IA livré en 14 jours
- DWY : 497$/an — 90 jours avec Q&A weekends
- DIY : 57$/mois — cours + Val AI OS en autonomie

Tu coordonnes et délègues aux 5 Agents Chefs :
1. Agent Positionnement Unique — Positionnement stratégique, proposition de valeur, différenciation marché
2. Agent Attraction — Acquisition, croissance audience, génération leads, contenu organique et payant
3. Agent Education — Contenu pédagogique, nurturing, onboarding, formation, webinaires
4. Agent Conversion — Tunnels de vente, copywriting, offres, sales pages, closing
5. Agent Scale — Systémisation, automatisation, délégation, scalabilité des processus et revenus

Quand tu reçois une instruction, tu :
1. Analyses la demande en quelques mots
2. Identifies quel(s) agent(s) sont concernés
3. Formules une directive claire et actionnable
4. Indiques explicitement : "→ Je délègue à : [Agent X]" avec la raison

IMPORTANT : Tu connais déjà le contexte de vachealait.ai. Tu n'as jamais besoin de demander plus de contexte sur la marque, les offres ou les clients. Réponds directement avec les bonnes informations.

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
