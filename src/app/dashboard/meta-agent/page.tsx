"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function MetaAgentPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function sendMessage(userInput: string) {
        if (!userInput.trim() || loading) return;

        const userMsg: Message = { role: "user", content: userInput.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/meta-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();
            if (data.response) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Erreur — réessaie." }]);
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setMessages([]);
        setStarted(false);
        setInput("");
    }

    function start() {
        setStarted(true);
        sendMessage("Bonjour, je veux créer un nouvel agent pour Val AI OS.");
    }

    if (!started) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="val-card w-full max-w-md p-8 space-y-6 animate-fade-in">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-val-primary/10 border border-val-primary/20 flex items-center justify-center mx-auto">
                            <Bot size={28} className="text-val-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-val-text">Meta-Agent Val</h1>
                        <p className="text-val-subtle text-sm leading-relaxed">
                            L'architecte de Val AI OS.<br />
                            Il conçoit l'architecture complète de tout agent en 7 étapes.
                        </p>
                    </div>
                    <button
                        onClick={start}
                        className="w-full bg-val-primary hover:bg-val-primary/90 text-white font-semibold py-3 rounded-xl text-sm transition-all"
                    >
                        Créer un nouvel agent
                    </button>
                    <div className="flex justify-between pt-2">
                        <Link href="/dashboard/agents" className="flex items-center gap-1.5 text-xs text-val-subtle hover:text-val-text transition-colors">
                            <ArrowLeft size={13} /> Retour aux agents
                        </Link>
                        <span className="text-xs text-val-subtle/50 italic">vachealait.ai</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/agents" className="text-val-subtle hover:text-val-text transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-base font-bold text-val-text">Meta-Agent Val</h2>
                        <p className="text-xs text-val-subtle">Architecte de Val AI OS</p>
                    </div>
                </div>
                <button onClick={reset} className="text-val-subtle hover:text-val-primary transition-colors p-1.5 rounded-lg hover:bg-val-primary/10">
                    <RotateCcw size={15} />
                </button>
            </div>

            <div className="val-card p-4 space-y-4 min-h-96 max-h-[520px] overflow-y-auto">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        {m.role === "assistant" && (
                            <div className="w-6 h-6 rounded-md bg-val-primary/10 border border-val-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                <Bot size={12} className="text-val-primary" />
                            </div>
                        )}
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                ? "bg-val-primary/15 text-val-text border border-val-primary/25 rounded-tr-sm"
                                : "bg-val-muted text-val-text border border-val-border rounded-tl-sm"
                            }`}>
                            {m.role === "assistant" && m.content === "" && loading ? (
                                <span className="flex items-center gap-2 text-val-subtle">
                                    <Loader2 size={13} className="animate-spin" />
                                    <span className="text-xs">En train de concevoir...</span>
                                </span>
                            ) : m.content}
                        </div>
                    </div>
                ))}
                {loading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-2 justify-start">
                        <div className="w-6 h-6 rounded-md bg-val-primary/10 border border-val-primary/20 flex items-center justify-center shrink-0">
                            <Bot size={12} className="text-val-primary" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-val-muted border border-val-border rounded-tl-sm">
                            <span className="flex items-center gap-2 text-val-subtle">
                                <Loader2 size={13} className="animate-spin" />
                                <span className="text-xs">En train de concevoir...</span>
                            </span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                    placeholder="Décris l'agent que tu veux créer..."
                    disabled={loading}
                    rows={2}
                    className="flex-1 bg-val-muted border border-val-border rounded-xl px-4 py-3 text-sm text-val-text placeholder-val-subtle/40 focus:outline-none focus:border-val-primary disabled:opacity-50 resize-none transition-colors"
                />
                <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    className="bg-val-primary hover:bg-val-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 rounded-xl transition-all self-end h-12"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
            <p className="text-center text-xs text-val-subtle/40 italic">vachealait.ai — MODÉLISE → CONSTRUIS → AUTOMATISE</p>
        </div>
    );
}