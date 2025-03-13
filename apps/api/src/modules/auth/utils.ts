import jwt from "jsonwebtoken";

const SECRET_KEY =
  process.env.JWT_SECRET || "FUTBOL_CLUB_DE_BARCELONA_IS_THE_GREATEST";

interface Payload {
  sub: string;
}

export function signData(payload: Payload, expiresIn: string = "1d"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): Payload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as Payload;
  } catch (error) {
    console.error("Invalid Token:", error.message);
    return null;
  }
}
