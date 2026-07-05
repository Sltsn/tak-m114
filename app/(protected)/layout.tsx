import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
