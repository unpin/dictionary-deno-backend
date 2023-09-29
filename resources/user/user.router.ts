import { Router } from "oak";
import { getByEmail, signin, signup } from "./user.controller.ts";

export const userRouter = new Router();

userRouter
  .post("/auth/signup", signup)
  .post("/auth/signin", signin)
  .post("/auth/email", getByEmail);
