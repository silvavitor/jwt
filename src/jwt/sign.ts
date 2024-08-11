import { generateSignature } from "./generateSignature";

type SignOptions = {
  data: Record<string, any>;
  exp: number;
  secret: string;
};

export function sign({ data, exp, secret }: SignOptions) {
  if (!secret) {
    throw new Error("Secret is required for signing");
  }
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    ...data,
    iat: Date.now(),
    exp: exp,
  };

  const base64EncodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );

  const base64EncodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signature = generateSignature({
    secret,
    header: base64EncodedHeader,
    payload: base64EncodedPayload,
  });

  return `${base64EncodedHeader}.${base64EncodedPayload}.${signature}`;
}
