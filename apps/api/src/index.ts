import { serve } from "@hono/node-server";
import { Hono } from "hono";
import v1Router from "./modules/routers/v1";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/v1", v1Router);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
