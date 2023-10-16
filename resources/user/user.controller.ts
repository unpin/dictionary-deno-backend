import { Context, createHttpError, Status } from "oak";
import { User } from "./user.model.ts";
import { compareSync, hashSync } from "bcrypt";
import { signToken } from "../../common/jwt.ts";

export async function signup(ctx: Context) {
  const { name, email, password } = await ctx.request.body({ type: "json" })
    .value;
  const foundUser = await User.findOne({ email });
  if (foundUser) throw createHttpError(Status.Conflict);
  const hashedPassword = hashSync(password);
  const _id = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = await signToken({ _id, email });
  ctx.response.body = { name, email, token };
}

export async function signin(ctx: Context) {
  const { email, password } = await ctx.request.body({ type: "json" })
    .value;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(Status.BadRequest, "User with the email not found");
  }
  if (!compareSync(password, user.password)) {
    throw createHttpError(Status.BadRequest, "Password is incorrect");
  }
  const token = await signToken({ _id: user._id, email: user.email });
  ctx.response.body = { name: user.name, email: user.email, token };
}

export async function getByEmail(ctx: Context) {
  const { email } = await ctx.request.body({ type: "json" })
    .value;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(Status.NotFound);
  }
  ctx.response.status = Status.OK;
  ctx.response.body = {
    status: Status.OK,
    data: {
      name: user.name,
      email: user.email,
    },
  };
}
