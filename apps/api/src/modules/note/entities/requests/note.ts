import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const noteCreationObject = z.object({
  title: z.string(),
  content: z.string(),
  extra: z.string(),
});

const noteCreationValidator = zValidator("json", noteCreationObject);

export default noteCreationValidator;
