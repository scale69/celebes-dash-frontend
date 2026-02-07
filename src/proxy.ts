import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/sign-in";
  const JWT_SECRET = process.env.JWT_SECRET;

  // 1. Jika TIDAK ADA token dan user BUKAN di halaman login, tendang ke login
  // if (!token && isLoginPage) {
  //   return NextResponse.next();
  // }

  // // 2. Jika ADA token dan user mencoba akses halaman login, lempar ke dashboard/home
  // // Agar user yang sudah login tidak bisa buka halaman login lagi
  // if (!token && !isLoginPage) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }

  // try {
  //   const secret_key = new TextEncoder().encode(JWT_SECRET);

  //   await jwtVerify(String(token), secret_key);
  //   if (isLoginPage) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  //   return NextResponse.next();
  // } catch (error) {
  //   const response = NextResponse.redirect(new URL("/sign-in", request.url));
  //   response.cookies.delete("access_token");
  //   return response;
  // }

  // 3. Jika semuanya OK (punya token dan akses halaman selain login), biarkan LANJUT
}
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  // matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
  // matcher: "/articles",
};
