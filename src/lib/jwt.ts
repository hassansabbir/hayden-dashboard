export interface AccessTokenClaims {
  userId: string;
  role: string;
  mustResetPassword: boolean;
  exp?: number;
  iat?: number;
}

// Client-side read of the access token's own claims — not a security
// boundary (the server re-verifies on every request), just lets the UI
// react to mustResetPassword without calling routes the server blocks
// for accounts that haven't reset their temporary password yet.
export const decodeAccessToken = (token: string): AccessTokenClaims | null => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};
