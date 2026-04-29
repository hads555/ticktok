import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user?.name ?? "User"} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      <footer className="max-w-5xl py-6 text-center text-xs text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm mx-auto">
        © 2024 tentwenty. All rights reserved.
      </footer>
    </div>
  );
}
