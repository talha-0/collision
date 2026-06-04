import { PortalSidebar } from "@/components/portal/portal-sidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <PortalSidebar />
      <main className="flex-1 overflow-auto bg-muted/20">
        {children}
      </main>
    </div>
  );
}
