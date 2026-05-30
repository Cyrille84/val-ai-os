"use client";

import { Sparkles, Plus, Play } from "lucide-react";
import clsx from "clsx";

const SAMPLE_SKILLS = [
  { id: "s1", name: "Web Search",       description: "Recherche d'informations sur le web en temps réel.", active: true,  category: "Research" },
  { id: "s2", name: "Code Executor",    description: "Exécute du code Python/JS dans un sandbox sécurisé.", active: true,  category: "Dev" },
  { id: "s3", name: "PDF Reader",       description: "Lit et extrait le contenu de fichiers PDF.",           active: false, category: "Files" },
  { id: "s4", name: "Image Generator",  description: "Génère des images via un modèle de diffusion.",        active: false, category: "Creative" },
  { id: "s5", name: "Email Sender",     description: "Envoie des emails depuis les agents.",                  active: false, category: "Comms" },
];

export default function SkillsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Skills</h2>
          <p className="text-val-subtle text-sm">Capacités disponibles pour les agents</p>
        </div>
        <button className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Nouveau skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SAMPLE_SKILLS.map((skill) => (
          <div key={skill.id} className="val-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-val-primary/10 border border-val-primary/20 text-val-primary">
                  <Sparkles size={17} />
                </div>
                <div>
                  <p className="font-semibold text-val-text text-sm">{skill.name}</p>
                  <span className="text-xs text-val-subtle">{skill.category}</span>
                </div>
              </div>
              <div className={clsx(
                "w-8 h-4 rounded-full transition-all cursor-pointer",
                skill.active ? "bg-val-primary" : "bg-val-muted"
              )} />
            </div>
            <p className="text-sm text-val-subtle">{skill.description}</p>
            <button className="flex items-center gap-1.5 text-xs text-val-primary hover:text-val-primary/80 font-medium transition-colors">
              <Play size={11} /> Tester
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
