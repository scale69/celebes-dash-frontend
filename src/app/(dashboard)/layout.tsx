import "../globals.css";

import AdminPanelLayout from "@/components/admin-panel/adimin-panel-layout";
// import "@/lib/axios/interceptor"


export default function DasboradLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <AdminPanelLayout>
      {children}
    </AdminPanelLayout>
  )
}
