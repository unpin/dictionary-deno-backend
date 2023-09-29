import { Context, isHttpError, Next, Status } from "oak";

export async function errorHandler(
  { response }: Context,
  next: Next,
) {
  try {
    await next();
  } catch (e) {
    if (isHttpError(e)) {
      response.status = e.status;
      if (e.expose) {
        response.body = { error: e.message };
      }
    } else {
      response.status = Status.InternalServerError;
    }
    console.error(e);
  }
}
