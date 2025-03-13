import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const signInRequest = z.object({
  username: z
    .string()
    .toLowerCase()
    .max(50, "username cannot be longer than 50"),
  password: z.string(),
});

const signInValidator = zValidator("json", signInRequest);

export default signInValidator;
