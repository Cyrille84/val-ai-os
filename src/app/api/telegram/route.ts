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
  const body = await req.json();
  
  // Vérification que c'est bien un message Telegram
  const message = body?.message;
  if (!message?.text || !message?.chat?.id) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const chatId = message.chat.id;
  const userText = message.text;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || !botToken) {
    return new Response(JSON.stringify({ ok: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Appel à l'Agent COO
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userText }],
  });

  const replyText =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Je n'ai pas pu générer de réponse.";

  // Envoi de la réponse sur Telegram
  await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: "Markdown",
      }),
    }
  );

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}