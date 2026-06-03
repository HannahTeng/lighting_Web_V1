import Sidebar from "@/components/admin/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg text-ink">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <main className="p-6 md:p-10">
          <div className="max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
