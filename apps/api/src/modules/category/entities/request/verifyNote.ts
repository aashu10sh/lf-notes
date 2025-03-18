import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const noteBody = z.object({
  categoryId: z.number(),
});

const verifyNoteBody = zValidator("json", noteBody);

export default verifyNoteBody;
