import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Val AI OS",
  description: "Dashboard de gestion d'agents IA — powered by #Val",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-val-bg text-val-text antialiased">{children}</body>
    </html>
  );
}
