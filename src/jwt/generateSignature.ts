import { createHmac } from "crypto";

type GenerateSignatureParams = {
  secret: string;
  header: string;
  payload: string;
};
export function generateSignature({
  secret,
  header,
  payload,
}: GenerateSignatureParams) {
  const hmac = createHmac("sha256", secret);

  return hmac.update(`${header}.${payload}`).digest("base64url");
}
