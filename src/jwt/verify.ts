import { generateSignature } from "./generateSignature";

type VerifyOptions = {
  token: string;
  secret: string;
};

export function verify({ token, secret }: VerifyOptions) {
  if (!secret) {
    throw new Error("Secret is required to verify");
  }

  const splitedToken = token.split(".");
  if (splitedToken.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  const [header, payload, signatureSent] = splitedToken;

  const signature = generateSignature({
    header,
    payload,
    secret,
  });

  if (signatureSent !== signature) {
    throw new Error("Invalid JWT token");
  }

  const decodedPayload = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf-8")
  );

  if (decodedPayload.exp < Date.now()) {
    throw new Error("Expired token");
  }

  return decodedPayload;
}
