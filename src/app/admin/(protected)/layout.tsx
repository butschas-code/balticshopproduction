import { CmsAuthGate, CmsAuthProvider } from "@/components/cms/admin/CmsAuthProvider";
import { AdminShell } from "@/components/cms/admin/AdminShell";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <CmsAuthProvider>
      <CmsAuthGate>
        <AdminShell>{children}</AdminShell>
      </CmsAuthGate>
    </CmsAuthProvider>
  );
}
