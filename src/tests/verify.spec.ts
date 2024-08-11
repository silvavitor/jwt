import { generateSignature } from "../jwt/generateSignature";
import { verify } from "../jwt/verify";

jest.mock("../jwt/generateSignature");

const mockedGenerateSignature = generateSignature as jest.Mock;

describe("verify", () => {
  const mockSecret = "mysecret";
  const mockPayload = { userId: 123, exp: Date.now() + 10000 };
  const mockToken = "header.payload.mocksignature";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the decoded payload for a valid token", () => {
    mockedGenerateSignature.mockReturnValue("mocksignature");

    const payloadBase64 = Buffer.from(JSON.stringify(mockPayload)).toString(
      "base64url"
    );
    const token = `header.${payloadBase64}.mocksignature`;

    const result = verify({ token, secret: mockSecret });

    expect(result).toEqual(mockPayload);
  });

  it("should throw an error for a token with an invalid format", () => {
    const invalidToken = "header.payload";

    expect(() => verify({ token: invalidToken, secret: mockSecret })).toThrow(
      "Invalid JWT token"
    );
  });

  it("should throw an error for a token with an invalid signature", () => {
    mockedGenerateSignature.mockReturnValue("invalidsignature");

    expect(() => verify({ token: mockToken, secret: mockSecret })).toThrow(
      "Invalid JWT token"
    );
  });

  it("should throw an error for an expired token", () => {
    const expiredPayload = { userId: 123, exp: Date.now() - 10000 };
    const payloadBase64 = Buffer.from(JSON.stringify(expiredPayload)).toString(
      "base64url"
    );
    const token = `header.${payloadBase64}.mocksignature`;

    mockedGenerateSignature.mockReturnValue("mocksignature");

    expect(() => verify({ token, secret: mockSecret })).toThrow(
      "Expired token"
    );
  });

  it("should throw an error for an empty token", () => {
    expect(() => verify({ token: "", secret: mockSecret })).toThrow(
      "Invalid JWT token"
    );
  });

  it("should throw an error for an empty secret", () => {
    mockedGenerateSignature.mockReturnValue("mocksignature");

    expect(() => verify({ token: mockToken, secret: "" })).toThrow(
      "Secret is required to verify"
    );
  });
});
