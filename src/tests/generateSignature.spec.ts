import { generateSignature } from "../jwt/generateSignature";

describe("generateSignature", () => {
  it("should generate correct HMAC signature", () => {
    const secret = "secret";
    const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const payload =
      "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";

    const expectedSignature = "XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o";

    const signature = generateSignature({
      header,
      payload,
      secret,
    });

    expect(expectedSignature).toBe(signature);
  });
});
