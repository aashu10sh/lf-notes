import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const signUpRequest = z.object({
  username: z
    .string()
    .toLowerCase()
    .max(50, "username cannot be longer than 50"),
  name: z.string(),
  password: z.string(),
});

const signUpValidator = zValidator("json", signUpRequest);

export default signUpValidator;
