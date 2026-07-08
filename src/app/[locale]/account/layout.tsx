import { Link } from "@/i18n/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="mb-10 border-b border-fog pb-4 flex flex-wrap gap-6 text-sm">
          <Link href="/account/orders" className="text-forest hover:text-amber transition-colors">
            Orders
          </Link>
          <Link href="/account/profile" className="text-forest hover:text-amber transition-colors">
            Profile & Addresses
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
