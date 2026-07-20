import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-forest">Dashboard</h2>
        <p className="mt-2 text-driftwood">Manage your Baltic Artisan stories and Instagram pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/stories" className="admin-card hover:border-amber transition-colors">
          <h3 className="font-serif text-xl">Stories</h3>
          <p className="mt-2 text-sm text-driftwood">Create, edit, and publish stories.</p>
        </Link>
        <Link href="/admin/social" className="admin-card hover:border-amber transition-colors">
          <h3 className="font-serif text-xl">Instagram</h3>
          <p className="mt-2 text-sm text-driftwood">Review captions and prepare posts for Instagram.</p>
        </Link>
        <Link href="/admin/pipeline" className="admin-card hover:border-amber transition-colors">
          <h3 className="font-serif text-xl">Pipeline</h3>
          <p className="mt-2 text-sm text-driftwood">Queue topics and configure Instagram automation settings.</p>
        </Link>
        <Link href="/admin/categories" className="admin-card hover:border-amber transition-colors">
          <h3 className="font-serif text-xl">Categories</h3>
          <p className="mt-2 text-sm text-driftwood">Organize stories by theme.</p>
        </Link>
      </div>
    </div>
  );
}
