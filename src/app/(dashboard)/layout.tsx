import AuthProvider from "@/utils/providers/AuthProvider";
import "../globals.css";

import AdminPanelLayout from "@/components/admin-panel/adimin-panel-layout";

export default function DasboradLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <AdminPanelLayout>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AdminPanelLayout>
  )
}
