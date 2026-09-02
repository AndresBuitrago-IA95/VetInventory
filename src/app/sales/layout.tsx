import { redirect } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import DashboardLayout from "@/components/DashboardLayout";

export default function SalesLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  if (!user) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
