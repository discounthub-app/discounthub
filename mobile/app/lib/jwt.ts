// app/lib/jwt.ts

export type JwtPayload = Record<string, any>;

/** Безопасно декодирует payload из JWT (base64url) */
export function decodeJwtPayload(token?: string): JwtPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  // base64url -> base64
  let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  // паддинг
  while (b64.length % 4 !== 0) b64 += '=';

  try {
    let json: string;
    if (typeof atob === 'function') {
      // web
      json = decodeURIComponent(
        escape(atob(b64)) // escape для корректной декодировки юникода
      );
    } else if (typeof Buffer !== 'undefined') {
      // native
      json = Buffer.from(b64, 'base64').toString('utf8');
    } else {
      return null;
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Пробует вытащить seller_id из разных возможных клеймов */
export function getSellerIdFromToken(token?: string): number | null {
  const p = decodeJwtPayload(token);
  if (!p) return null;

  return (
    (typeof p.seller_id === 'number' && p.seller_id) ||
    (typeof p.sellerId === 'number' && p.sellerId) ||
    (typeof p.user_id === 'number' && p.user_id) ||
    (typeof p.sub === 'number' && p.sub) ||
    null
  );
}