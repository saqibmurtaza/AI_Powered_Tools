/**
 * Helper to get current Clerk user and token
 */
export async function getClerkUser(): Promise<{ userId?: string; token?: string }> {
  try {
    // @ts-ignore
    const clerk = window?.Clerk;
    if (!clerk || !clerk.user) return {};

    const userId = clerk.user.id || undefined;
    const token = await clerk.user.getToken();
    return { userId, token };
  } catch (err) {
    console.warn("⚠️ Failed to get Clerk user:", err);
    return {};
  }
}
