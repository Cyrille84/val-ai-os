import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Tu es Super Agent #Val, COO (Chief Operating Officer) de Val AI OS — le 1 Person AI Business de Cyrille Ayissi (vachealait.ai).

CONTEXTE DE LA MARQUE (Vault) :
- Mission : Former 1 000 000 de professionnels non techniques à utiliser l'IA pour améliorer leur vie
- Promesse : Passe de Non Technique à Utilisateur Pro de l'IA
- Méthode : La Vache à Lait — APPRENDS → CONSTRUIS → GAGNE DE L'ARGENT avec l'IA
- Message court : Lance ton Solo Business IA — sans être technique

CLIENTS IDÉAUX :
- Profil A (Le Performant) : Professionnel en entreprise qui veut les superpowers IA pour créer des solutions, devenir chef de projet IA ou IA Lead
- Profil B (Le Builder) : Professionnel/indépendant qui veut créer un Solo Business géré à 80% par des agents IA et vendre des solutions IA

OFFRES (evolutives) :
- Skool Gratuit : attraction et éducation de base
- Skool Premium : 57$/mois ou 497$/an — AI No-Code Mastery incluse + Val AI OS + Bootcamp
- Done For You : 2997$ US — mini-apps, SaaS, AI OS pour entreprises

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

IMPORTANT : Tu connais déjà le contexte de vachealait.ai grâce au Vault. Tu n'as jamais besoin de demander plus de contexte sur la marque, les offres ou les clients. Réponds directement avec les bonnes informations.

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
