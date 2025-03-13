import { Hono } from "hono";
import authRouter from "../auth/router";

const v1Router = new Hono();

v1Router.route("/auth", authRouter);

export default v1Router;
