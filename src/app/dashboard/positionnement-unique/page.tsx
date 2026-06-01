"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, RotateCcw, Download, Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const ETAPES = ["Problème DUR", "Mécanisme", "Client idéal", "Message", "Offre OTI"];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Recap {
  probleme?: string;
  mecanisme?: string;
  client?: string;
  message?: string;
  offre?: string;
}

function extractJSON(text: string) {
  const patterns = [
    /\{"etape"\s*:\s*(\d+)\s*,\s*"pct"\s*:\s*(\d+)[^}]*\}/,
    /\{"etape"\s*:\s*(\d+)[^}]*\}/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* skip */ }
    }
  }
  // Fallback : extraire etape et pct manuellement
  const etapeMatch = text.match(/"etape"\s*:\s*(\d+)/);
  const pctMatch = text.match(/"pct"\s*:\s*(\d+)/);
  if (etapeMatch) {
    return {
      etape: parseInt(etapeMatch[1]),
      pct: pctMatch ? parseInt(pctMatch[1]) : (parseInt(etapeMatch[1]) - 1) * 20,
      recap: {}
    };
  }
  return null;
}

function cleanText(text: string) {
  return text
    .replace(/\{[\s\S]*?"etape"[\s\S]*?\}/g, "")
    .replace(/\}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseOptions(text: string) {
  const options: string[] = [];
  const lines = text.split("\n");
  let cur = "";
  for (const line of lines) {
    const m = line.match(/^(Option\s*[123]|[123][.):])\s*[-:]?\s*(.+)/i);
    if (m) { if (cur) options.push(cur.trim()); cur = m[2]; }
    else if (cur && line.trim()) cur += " " + line.trim();
  }
  if (cur) options.push(cur.trim());
  return options.slice(0, 3);
}

export default function PositionnementUniquePage() {
  const [prenom, setPrenom] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [etape, setEtape] = useState(1);
  const [pct, setPct] = useState(0);
  const [recap, setRecap] = useState<Recap>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function callAPI(msgs: Message[]) {
    const res = await fetch("/api/agent-positionnement-unique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, prenom }),
    });
    if (!res.ok || !res.body) throw new Error("Erreur API");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done: d, value } = await reader.read();
          if (d) { controller.close(); break; }
          const raw = decoder.decode(value, { stream: true });
          for (const line of raw.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") { controller.close(); return; }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.text) {
                accumulated += parsed.text;
                controller.enqueue(accumulated);
              }
            } catch { /* skip */ }
          }
        }
      }
    });
  }

  async function streamResponse(msgs: Message[]) {
    setLoading(true);
    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/agent-positionnement-unique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, prenom }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur API");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        const raw = decoder.decode(value, { stream: true });
        for (const line of raw.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }

      // Extraire étape et pct directement avec regex simple
      const etapeMatch = accumulated.match(/"etape"\s*:\s*(\d+)/);
      const pctMatch = accumulated.match(/"pct"\s*:\s*(\d+)/);
      if (etapeMatch) {
        const newEtape = parseInt(etapeMatch[1]);
        const newPct = pctMatch ? parseInt(pctMatch[1]) : (newEtape - 1) * 20;
        if (newEtape > 0 && newEtape <= 6) setEtape(newEtape);
        if (newPct >= 0 && newPct <= 100) setPct(newPct);
        if (newEtape >= 6) setDone(true);
      }
      // Extraire recap si présent
      const ex = extractJSON(accumulated);
      if (ex?.recap && Object.keys(ex.recap).length > 0) {
        setRecap(r => ({ ...r, ...ex.recap }));
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: cleanText(accumulated) };
        return updated;
      });

    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: `Désolé ${prenom}, une erreur s'est produite. Réessaie.` };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  async function start() {
    if (!prenom.trim()) return;
    setStarted(true);
    setLoading(true);
    await streamResponse([{ role: "user", content: `Démarre la session de coaching pour ${prenom}.` }]);
  }

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setInput("");
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    await streamResponse(newMessages.filter(m => m.content.trim()));
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setInput("");
    setEtape(1);
    setPct(0);
    setRecap({});
    setDone(false);
    setPrenom("");
  }

  function buildRecapText() {
    const labels = ["PROBLÈME DUR", "MÉCANISME UNIQUE", "CLIENT IDÉAL", "MESSAGE FONDAMENTAL", "OFFRE OTI"];
    const keys: (keyof Recap)[] = ["probleme", "mecanisme", "client", "message", "offre"];
    const lines = [
      `POSITIONNEMENT UNIQUE #VAL — ${prenom.toUpperCase()}`,
      `Généré par Agent Positionnement Unique — Val AI OS | vachealait.ai`,
      "=".repeat(50), "",
    ];
    keys.forEach((k, i) => { lines.push(`${i + 1}. ${labels[i]}`); lines.push(recap[k] || "—"); lines.push(""); });
    lines.push("=".repeat(50));
    lines.push("vachealait.ai — Apprends — Construis — Gagne de l'argent avec l'IA");
    return lines.join("\n");
  }

  function download() {
    const blob = new Blob([buildRecapText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `positionnement-val-${prenom.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyAll() {
    navigator.clipboard.writeText(buildRecapText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
  const options = lastAssistant && !loading ? parseOptions(lastAssistant.content) : [];

  // ── ÉCRAN DE DÉMARRAGE ──
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="val-card w-full max-w-md p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-val-primary/10 border border-val-primary/20 flex items-center justify-center mx-auto">
              <Bot size={28} className="text-val-primary" />
            </div>
            <h1 className="text-xl font-bold text-val-text">Agent Positionnement Unique</h1>
            <p className="text-val-subtle text-sm leading-relaxed">
              Construis ton positionnement unique en 5 étapes guidées.<br />
              Ton coach IA #Val analyse le marché et te guide.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-val-subtle mb-1.5 block font-medium">Ton prénom</label>
              <input
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                onKeyDown={e => e.key === "Enter" && start()}
                placeholder="Ex: Marie"
                className="w-full bg-val-muted border border-val-border rounded-xl px-4 py-3 text-sm text-val-text placeholder-val-subtle/40 focus:outline-none focus:border-val-primary transition-colors"
              />
            </div>
            <button
              onClick={start}
              disabled={!prenom.trim()}
              className="w-full bg-val-primary hover:bg-val-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all val-glow-sm"
            >
              Démarrer mon coaching
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href="/dashboard/agents" className="flex items-center gap-1.5 text-xs text-val-subtle hover:text-val-text transition-colors">
              <ArrowLeft size={13} /> Retour aux agents
            </Link>
            <span className="text-xs text-val-subtle/50 italic">vachealait.ai</span>
          </div>
        </div>
      </div>
    );
  }

  // ── ÉCRAN DE RÉSULTAT ──
  if (done) {
    const labels = ["Problème DUR", "Mécanisme unique", "Client idéal", "Message fondamental", "Offre OTI"];
    const keys: (keyof Recap)[] = ["probleme", "mecanisme", "client", "message", "offre"];
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-6">
        <div className="val-card p-6 text-center space-y-2">
          <div className="text-3xl">🎉</div>
          <h2 className="text-xl font-bold text-val-text">Bravo {prenom} !</h2>
          <p className="text-val-subtle text-sm">Ton positionnement unique #Val est prêt.</p>
        </div>

        <div className="space-y-3">
          {keys.map((k, i) => (
            <div key={k} className="val-card p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-val-primary">{i + 1}. {labels[i]}</p>
              <p className="text-sm text-val-text leading-relaxed">{recap[k] || "—"}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={download} className="flex-1 flex items-center justify-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white font-semibold py-3 rounded-xl text-sm transition-all val-glow-sm">
            <Download size={15} /> Télécharger
          </button>
          <button onClick={copyAll} className="flex-1 flex items-center justify-center gap-2 bg-val-muted hover:bg-val-muted/80 border border-val-border text-val-text font-semibold py-3 rounded-xl text-sm transition-all">
            {copied ? <><Check size={15} className="text-green-400" /> Copié !</> : <><Copy size={15} /> Copier</>}
          </button>
        </div>

        <button onClick={reset} className="w-full flex items-center justify-center gap-2 text-val-subtle hover:text-val-text text-sm transition-colors py-2">
          <RotateCcw size={14} /> Recommencer
        </button>
      </div>
    );
  }

  // ── ÉCRAN PRINCIPAL ──
  const ei = Math.max(1, Math.min(etape, 5));

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in py-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agents" className="text-val-subtle hover:text-val-text transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-base font-bold text-val-text">Agent Positionnement Unique</h2>
            <p className="text-xs text-val-subtle">Bonjour {prenom} 👋</p>
          </div>
        </div>
        <button onClick={reset} className="text-val-subtle hover:text-val-primary transition-colors p-1.5 rounded-lg hover:bg-val-primary/10">
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Étapes */}
      <div className="val-card p-3 space-y-2">
        <div className="flex gap-1">
          {ETAPES.map((e, i) => (
            <div key={e} className={clsx(
              "flex-1 py-1.5 px-1 rounded-lg text-center text-xs font-medium transition-all",
              i + 1 < ei ? "bg-green-400/15 text-green-400" :
                i + 1 === ei ? "bg-val-primary text-white" :
                  "bg-val-muted text-val-subtle/40"
            )}>
              {i + 1 < ei ? "✓" : i + 1}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-val-muted rounded-full overflow-hidden">
          <div className="h-full bg-val-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-val-subtle text-right">{pct}% — Étape {ei}/5 : {ETAPES[ei - 1]}</p>
      </div>

      {/* Messages */}
      <div className="val-card p-4 space-y-4 min-h-96 max-h-[480px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={clsx("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-val-primary/10 border border-val-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-val-primary" />
              </div>
            )}
            <div className={clsx(
              "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
              m.role === "user"
                ? "bg-val-primary/15 text-val-text border border-val-primary/25 rounded-tr-sm"
                : "bg-val-muted text-val-text border border-val-border rounded-tl-sm"
            )}>
              {m.role === "assistant" && m.content === "" && loading ? (
                <span className="flex items-center gap-2 text-val-subtle">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="text-xs">En train de réfléchir...</span>
                </span>
              ) : m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Options */}
      {options.length === 3 && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setInput(`Option ${i + 1} : ${opt}`)}
              className="w-full text-left px-4 py-3 rounded-xl border border-val-border bg-val-muted hover:border-val-primary hover:bg-val-primary/5 text-sm text-val-text transition-all"
            >
              <span className="text-xs font-semibold text-val-primary uppercase tracking-wide block mb-0.5">Option {i + 1}</span>
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Écris ta réponse ou choisis une option ci-dessus..."
          disabled={loading}
          rows={2}
          className="flex-1 bg-val-muted border border-val-border rounded-xl px-4 py-3 text-sm text-val-text placeholder-val-subtle/40 focus:outline-none focus:border-val-primary disabled:opacity-50 resize-none transition-colors"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-val-primary hover:bg-val-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 rounded-xl transition-all val-glow-sm self-end h-12"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      <p className="text-center text-xs text-val-subtle/40 italic">vachealait.ai — Apprends — Construis — Gagne de l'argent avec l'IA</p>
    </div>
  );
}