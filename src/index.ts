import { sign } from "./jwt/sign";
import { verify } from "./jwt/verify";

const HOURS_IN_MS = 60 * 60 * 1000;

const secret = "jwt_secret";

// create token
const jwtToken = sign({
  data: {
    usr: "silvavitor",
    roles: ["admin"],
  },
  exp: Date.now() + 24 * HOURS_IN_MS,
  secret: secret,
});

// validate and get token
const decodedPayload = verify({ token: jwtToken, secret });

console.log({ decodedPayload });
