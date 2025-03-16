import jwt from "jsonwebtoken";
import { err, ok } from "neverthrow";
import { NapkinErrors } from "../core/errors";

const SECRET_KEY =
  process.env.JWT_SECRET || "FUTBOL_CLUB_DE_BARCELONA_IS_THE_GREATEST";

interface Payload {
  sub: string;
}

export function signData(payload: Payload, expiresIn: string = "1d"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyJWTToken(token: string) {
  try {
    const data = jwt.verify(token, SECRET_KEY) as Payload;
    return ok(data);
  } catch (error) {
    console.error("Invalid Token:", error.message);
    return err({
      message: error.message,
      type: NapkinErrors.INVALID_INPUT,
    });
  }
}
