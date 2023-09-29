import { Context, createHttpError, Next, Status } from "oak";
import { verifyToken } from "../common/jwt.ts";

export async function isAuth(ctx: Context, next: Next) {
  const header = ctx.request.headers.get("Authorization");
  if (!header) {
    throw createHttpError(Status.Unauthorized, "Authorization token required");
  }

  const token = header.split(/\s/)[1];

  try {
    const payload = await verifyToken(token);
    console.log({ payload });
    ctx.state.payload = payload;
  } catch {
    throw createHttpError(Status.Unauthorized, "Authorization token invalid");
  }
  await next();
}
