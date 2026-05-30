import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-val-content">
        <TopBar />
        <main className="flex-1 overflow-auto p-6 bg-val-content">
          {children}
        </main>
      </div>
    </div>
  );
}
