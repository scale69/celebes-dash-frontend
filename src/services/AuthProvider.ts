// // components/AuthProvider.tsx
// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function AuthProvider({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const publicRoutes = ["/sign-in", "/sign-up"];
//     if (publicRoutes.some((route) => pathname.startsWith(route))) {
//       setLoading(false);
//       return;
//     }

//     fetchAPI("/api/users/me/")
//       .then((user: User) => {
//         console.log("✅ User:", user);
//       })
//       .catch(() => {
//         console.log("⚠️ Not authenticated");
//         router.push("/sign-in");
//       })
//       .finally(() => setLoading(false));
//   }, [router, pathname]);

//   if (loading) return null;

//   return children;
// }
