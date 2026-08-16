import UserLayout from "@/layout/UserLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}

