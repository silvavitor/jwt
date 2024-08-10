import { generateSignature } from "./generateSignature";

type SignOptions = {
  data: Record<string, any>;
  exp: number;
  secret: string;
};

export function sign(options: SignOptions) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    ...options.data,
    iat: Date.now(),
    exp: options.exp,
  };

  const base64EncodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );

  const base64EncodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signature = generateSignature({
    secret: options.secret,
    header: base64EncodedHeader,
    payload: base64EncodedPayload,
  });

  return `${base64EncodedHeader}.${base64EncodedPayload}.${signature}`;
}
