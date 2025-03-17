import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const noteUpdateObject = z.object({
  title: z.string(),
  content: z.string(),
});

const noteUpdateValidator = zValidator("json", noteUpdateObject);

export default noteUpdateValidator;
