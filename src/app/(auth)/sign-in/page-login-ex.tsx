// "use client";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mail, Lock, Eye, EyeOff, Chrome, AlertCircle } from "lucide-react";
// import Link from "next/link";
// export default function Page() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleEmailLogin = async (e: any) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(""); // Reset error sebelum login

//     try {
//       const response = await fetch("http://localhost:8000/api/auth/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//         }),
//         credentials: "include",
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         // Tampilkan error dari server atau default message
//         setError(data.message || "Email atau password salah");
//         setIsLoading(false);
//         return;
//       }
//       console.log("Login berhasil:", data);
//       // Redirect atau handle success
//       window.location.href = "/";
//       setIsLoading(false);
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(`Terjadi kesalahan. Silakan coba lagi.`);
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     console.log("Login with Google");

//     window.location.href = "http://localhost:8000/api/auth/login/google/";
//   };

//   return (
//     <div className=" min-h-screen flex items-center justify-center  bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
//       {/* Background Decorations */}
//       {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-max bg-blue-400/20 rounded-full blur-3xl animate-pulse">
//         </div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-max bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div> */}

//       {/* Login Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative w-full max-w-md"
//       >
//         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-10">
//           {/* Logo & Title */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-center mb-8"
//           >
//             <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent mb-2">
//               LOGIN DASHBOARD
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 text-xs">
//               Masuk ke akun Anda untuk melanjutkan
//             </p>
//           </motion.div>

//           {/* Error Alert */}
//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start space-x-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
//                     Login Gagal
//                   </h3>
//                   <p className="text-sm text-red-700 dark:text-red-400">
//                     {error}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setError("")}
//                   className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Login Form */}
//           <motion.form
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             onSubmit={handleEmailLogin}
//             className="space-y-5"
//           >
//             {/* Email Input */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="email"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Email
//               </label>
//               <div className="relative group">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="example@gmail.com"
//                   required
//                   className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="password"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Password
//               </label>
//               <div className="relative group">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   required
//                   className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="text-sm text-gray-600 dark:text-gray-400">
//                   Ingat saya
//                 </span>
//               </label>
//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//               >
//                 Lupa password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               type="submit"
//               disabled={isLoading}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {/*{isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   <span>Memproses...</span>
//                 </>
//               ) : (
//                 <span>Masuk</span>
//               )}*/}
//               <span>Masuk</span>
//             </motion.button>
//           </motion.form>

//           {/* Divider */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="relative my-6"
//           >
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                 Atau lanjutkan dengan
//               </span>
//             </div>
//           </motion.div>

//           {/* Google Login Button */}
//           <motion.button
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             onClick={handleGoogleLogin}
//             disabled={isLoading}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             <span>Masuk dengan Google</span>
//           </motion.button>

//           {/* Sign Up Link */}
//           {/* <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.6 }}
//                         className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
//                     >
//                         Belum punya akun?{' '}
//                         <a
//                             href="#"
//                             className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//                         >
//                             Daftar sekarang
//                         </a>
//                     </motion.p> */}
//         </div>

//         {/* Footer Text */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.7 }}
//           className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400"
//         >
//           Dengan masuk, Anda menyetujui{" "}
//           <a
//             href="#"
//             className="underline hover:text-blue-600 transition-colors"
//           >
//             Syarat & Ketentuan
//           </a>{" "}
//           dan{" "}
//           <a
//             href="#"
//             className="underline hover:text-blue-600 transition-colors"
//           >
//             Kebijakan Privasi
//           </a>
//         </motion.p>
//       </motion.div>
//     </div>
//   );
// }
