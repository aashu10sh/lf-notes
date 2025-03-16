import { Hono } from "hono";
import authRouter from "../auth/router";
import noteRouter from "../note/router";

const v1Router = new Hono();

v1Router.route("/auth", authRouter);
v1Router.route("/note", noteRouter);

export default v1Router;
