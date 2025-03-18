import { Hono } from "hono";
import authRouter from "../auth/router";
import noteRouter from "../note/router";
import categoryRouter from "../category/router";

const v1Router = new Hono();

v1Router.route("/auth", authRouter);
v1Router.route("/note", noteRouter);
v1Router.route("/category", categoryRouter);

export default v1Router;
