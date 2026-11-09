// TEMPORARY: replaced by Supabase Auth before going live.
// Anything in this file can be seen in the browser's code.
export type AdminUser = { email: string; name: string; role: "admin" };

export const MOCK_ADMINS: (AdminUser & { password: string })[] = [
  { email: "admin@jnbtools.co.ke", password: "jnb12345", name: "JNB Admin", role: "admin" },
];