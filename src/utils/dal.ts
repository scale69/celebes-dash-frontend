import "server-only";

import { AuthUser } from "./auth";

export async function verifySession() {
  const user = await AuthUser();
  if (!user) {
    return { user: null, unauthorized: true }; // jangan redirect di sini
  }
  return { user, unauthorized: false };
}
