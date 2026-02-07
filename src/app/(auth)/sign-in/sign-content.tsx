"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// --- KOMPONEN UTAMA (Yang dipanggil oleh Next.js) ---
export default function SignInPage() {
    return (
        // Suspense ini adalah kunci untuk memperbaiki error build Anda
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-pulse text-blue-600 font-semibold">Memuat Halaman...</div>
            </div>
        }>
            <SignContent />
        </Suspense>
    );
}

// --- KOMPONEN KONTEN (Logika Form) ---
function SignContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [accessToken, setAccessToken] = useState<string | null>(null);


    const router = useRouter();
    const signInUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    // Get message from searchParams
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    // Menangkap pesan error dari URL (misal: redirect dari backend)
    useEffect(() => {
        // untuk debug localhost
        // const fetchAccessToken = async () => {
        //     try {
        //         const res = await fetch(`${signInUrl}/auth/token/`, {
        //             credentials: "include", // untuk kirim cookie
        //         });
        //         if (res.ok) {
        //             const data = await res.json();
        //             setAccessToken(data.access_token); // simpan di memory/state
        //         } else {
        //             router.push("/sign-in");
        //         }
        //     } catch (err) {
        //         router.push("/sign-in");
        //     }
        // };
        // fetchAccessToken();
        // ====================


        if (message) {
            setError(message);
        }

    }, [message]);

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            // Memastikan URL backend valid
            const baseUrl = signInUrl?.endsWith('/') ? signInUrl : `${signInUrl}/`;
            window.location.href = `${baseUrl}auth/login/google/`;
        } catch (err) {
            setIsLoading(false);
            setError("Gagal melakukan login dengan Google. Silakan coba lagi.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-10">

                    {/* Logo & Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent mb-2">
                            LOGIN DASHBOARD
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                            Masuk ke akun Anda untuk melanjutkan
                        </p>
                    </motion.div>

                    {/* Error Alert */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start space-x-3 mb-6"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                                        Login Gagal
                                    </h3>
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        {error}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setError("")}
                                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative my-6"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Login
                            </span>
                        </div>
                    </motion.div>

                    {/* Google Login Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span>{isLoading ? "Menghubungkan..." : "Masuk dengan Google"}</span>
                    </motion.button>
                </div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400"
                >
                    Dengan masuk, Anda menyetujui{" "}
                    <a href="#" className="underline hover:text-blue-600 transition-colors">Syarat & Ketentuan</a>{" "}
                    dan <a href="#" className="underline hover:text-blue-600 transition-colors">Kebijakan Privasi</a>
                </motion.p>
            </motion.div>
        </div>
    );
}