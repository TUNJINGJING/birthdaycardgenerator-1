import { createHmac, timingSafeEqual } from "crypto";

const SHARE_TOKEN_SEPARATOR = "~";

export interface ShareTokenPayload {
  prediction_id: string;
  created_at: number;
}

function getShareTokenSecret() {
  const secret = process.env.SHARE_TOKEN_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("SHARE_TOKEN_SECRET or NEXTAUTH_SECRET is required");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getShareTokenSecret())
    .update(value)
    .digest("base64url");
}

export function createShareToken(payload: ShareTokenPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}${SHARE_TOKEN_SEPARATOR}${sign(encodedPayload)}`;
}

export function verifyShareToken(token: string): ShareTokenPayload | null {
  const [encodedPayload, signature] = token.split(SHARE_TOKEN_SEPARATOR);
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as ShareTokenPayload;

    if (!payload.prediction_id || typeof payload.prediction_id !== "string") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
