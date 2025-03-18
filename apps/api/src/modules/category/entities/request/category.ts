import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const categoryCreationRequest = z.object({
  name: z.string(),
});

const categoryCreationValidator = zValidator("json", categoryCreationRequest);

export default categoryCreationValidator;
