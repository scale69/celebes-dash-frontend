// "use client";

// import { useEffect, useState } from "react";
// import { useAuthStore } from "@/lib/authStore";
// import api from "@/lib/axios/refres-token";
// import LoadingSession from "@/components/layout/loading-session";

// export default function AuthProvider({ children }: { children: React.ReactNode }) {
//     const setAccessToken = useAuthStore((s) => s.setAccessToken);
//     const setUser = useAuthStore((s) => s.setUser);
//     const clearAuth = useAuthStore((s) => s.clearAuth);
//     const [ready, setReady] = useState(false);

//     useEffect(() => {
//         const initAuth = async () => {
//             try {
//                 // Panggil refresh token endpoint, backend kirim access token
//                 const res = await api.post("/api/token/refresh/");
//                 setAccessToken(res.data.access_token);

//                 // // Dapat user detail
//                 const me = await api.get("/users/me/");
//                 setUser(me.data);
//             } catch {
//                 clearAuth();
//             } finally {
//                 setReady(true);
//             }
//         };
//         initAuth();
//     }, [setAccessToken, setUser, clearAuth]);

//     if (!ready) return <LoadingSession />
//     return <>{children}</>;
// }
