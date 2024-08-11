A simple JWT (JSON Web Token) library for signing and verifying tokens using HMAC SHA-256. This library is written in TypeScript and provides basic functionality for creating and validating JWT tokens.

## Features

- **Sign JWT:** Create a JWT token with a specified payload and expiration time.
- **Verify JWT:** Validate a JWT token and extract its payload.
- **HMAC SHA-256:** Secure signature generation using the HMAC SHA-256 algorithm.

## Installation

First, clone the repository and install dependencies:

```bash
git clone https://github.com/silvavitor/jwt.git
cd jwt
yarn install
```

## Run

```bash
yarn dev
```

## Test

```bash
yarn jest
```

## Usage

### Sign a Token

```typescript
import { sign } from "./src/jwt/sign";

const token = sign({
  data: { usr: "silvavitor", roles: ["admin"] },
  exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  secret: "jwt_secret",
});
```

### Verify a Token

```typescript
import { verify } from "./src/jwt/verify";

const decodedPayload = verify({ token, secret: "jwt_secret" });
```
