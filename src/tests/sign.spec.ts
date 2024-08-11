import { generateSignature } from "../jwt/generateSignature";
import { sign } from "../jwt/sign";

jest.mock("../jwt/generateSignature", () => ({
  generateSignature: jest.fn(),
}));

describe("sign", () => {
  const mockSecret = "mysecret";
  const mockData = { userId: 123 };
  const mockExp = 1000000;
  const mockHeader = {
    alg: "HS256",
    typ: "JWT",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a valid JWT token", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const expectedHeader = Buffer.from(JSON.stringify(mockHeader)).toString(
      "base64url"
    );

    const expectedPayload = Buffer.from(
      JSON.stringify({
        ...mockData,
        iat: mockDateNow,
        exp: mockExp,
      })
    ).toString("base64url");

    const expectedToken = `${expectedHeader}.${expectedPayload}.mocksignature`;

    const token = sign({
      data: mockData,
      exp: mockExp,
      secret: mockSecret,
    });

    expect(token).toBe(expectedToken);
  });

  it("should return a string in the format header.payload.signature", () => {
    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const token = sign({
      data: mockData,
      exp: mockExp,
      secret: mockSecret,
    });

    expect(token.split(".").length).toBe(3);
  });

  it("should handle empty data object", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const expectedHeader = Buffer.from(JSON.stringify(mockHeader)).toString(
      "base64url"
    );

    const expectedPayload = Buffer.from(
      JSON.stringify({
        iat: mockDateNow,
        exp: mockExp,
      })
    ).toString("base64url");

    const token = sign({
      data: {},
      exp: mockExp,
      secret: mockSecret,
    });

    expect(token).toBe(`${expectedHeader}.${expectedPayload}.mocksignature`);
  });

  it("should handle special characters in data", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    const specialData = {
      userId: 123,
      name: "John_Doe//",
      email: "john.doe@example.com",
      roles: ["admin!", "user$"],
      bio: "Loves programming & coffee!",
    };

    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const expectedHeader = Buffer.from(JSON.stringify(mockHeader)).toString(
      "base64url"
    );

    const expectedPayload = Buffer.from(
      JSON.stringify({
        ...specialData,
        iat: mockDateNow,
        exp: mockExp,
      })
    ).toString("base64url");

    const token = sign({
      data: specialData,
      exp: mockExp,
      secret: mockSecret,
    });

    expect(token).toBe(`${expectedHeader}.${expectedPayload}.mocksignature`);
  });

  it("should handle missing secret", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    expect(() => {
      sign({
        data: mockData,
        exp: mockExp,
        secret: "",
      });
    }).toThrow("Secret is required for signing");
  });

  it("should handle negative expiration time", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const expectedHeader = Buffer.from(JSON.stringify(mockHeader)).toString(
      "base64url"
    );

    const expectedPayload = Buffer.from(
      JSON.stringify({
        ...mockData,
        iat: mockDateNow,
        exp: -1000,
      })
    ).toString("base64url");

    const result = sign({
      data: mockData,
      exp: -1000,
      secret: mockSecret,
    });

    expect(result).toBe(`${expectedHeader}.${expectedPayload}.mocksignature`);
  });

  it("should handle data with nested objects", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    const nestedData = {
      userId: 123,
      profile: {
        name: "John Doe",
        age: 30,
        address: {
          street: "123 Main St",
          city: "Anytown",
        },
      },
    };

    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const expectedHeader = Buffer.from(JSON.stringify(mockHeader)).toString(
      "base64url"
    );

    const expectedPayload = Buffer.from(
      JSON.stringify({
        ...nestedData,
        iat: mockDateNow,
        exp: mockExp,
      })
    ).toString("base64url");

    const token = sign({
      data: nestedData,
      exp: mockExp,
      secret: mockSecret,
    });

    expect(token).toBe(`${expectedHeader}.${expectedPayload}.mocksignature`);
  });

  it("should handle data with undefined or null values", () => {
    const mockDateNow = 1609459200000;
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow);

    const dataWithNulls = {
      userId: 123,
      name: null,
      email: undefined,
    };

    (generateSignature as jest.Mock).mockReturnValue("mocksignature");

    const expectedHeader = Buffer.from(JSON.stringify(mockHeader)).toString(
      "base64url"
    );

    const expectedPayload = Buffer.from(
      JSON.stringify({
        ...dataWithNulls,
        iat: mockDateNow,
        exp: mockExp,
      })
    ).toString("base64url");

    const token = sign({
      data: dataWithNulls,
      exp: mockExp,
      secret: mockSecret,
    });

    expect(token).toBe(`${expectedHeader}.${expectedPayload}.mocksignature`);
  });
});
