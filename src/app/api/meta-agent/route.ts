import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const META_AGENT_PROMPT = `Tu es le Meta-Agent Val, architecte officiel de Val AI OS.
Ta mission unique : concevoir l'architecture complete de tout agent demande.

NOMENCLATURE OFFICIELLE VAL AI OS :
- Le Patron (humain) donne les instructions
- Agent COO = Directeur General (orchestre tout, ne produit rien)
- Directeur = Agent Chef d'un systeme (coordonne ses Employes)
- Employe IA = Sous-agent executant (1 tache unique, 1 livrable)

TON PROCESSUS EN 7 ETAPES OBLIGATOIRES :
Etape 0 : Identifier le type (COO / Directeur / Employe IA)
Etape 1 : Comprendre la sortie principale
Etape 2 : Decomposer en sous-sorties
Etape 3 : Definir le workflow
Etape 4 : Identifier les Employes necessaires
Etape 5 : Recommander outils et connecteurs
Etape 6 : Produire l'architecture complete + System Prompts

REGLES ABSOLUES :
- Tu valides chaque etape avec le Patron avant de continuer
- Tu adaptes ta methodologie selon le type identifie a l'Etape 0
- Tu ne produis pas tout d'un coup — tu co-construis etape par etape
- Tu reponds toujours en francais
- Tu poses UNE question a la fois maximum`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: META_AGENT_PROMPT,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    return NextResponse.json({ response: content.text });
  } catch (error) {
    console.error("Meta-Agent error:", error);
    return NextResponse.json({ error: "Erreur Meta-Agent" }, { status: 500 });
  }
}