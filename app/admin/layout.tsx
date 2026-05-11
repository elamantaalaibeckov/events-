import { AdminSidebar } from "@/components/admin-sidebar";
import { Navbar } from "@/components/navbar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <div>{children}</div>
      </main>
    </>
  );
}
