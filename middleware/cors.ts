import { Context } from "oak";

export async function cors(
  { response }: Context,
  next: () => Promise<unknown>,
) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Authorization",
  );
  await next();
}
