import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="px-4 py-10 max-w-3xl mx-auto">{children}</main>
    </div>
  );
}
