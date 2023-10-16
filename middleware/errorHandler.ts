import { Context, isHttpError, Next, Status } from "oak";
import { Logger } from "../common/logger.ts";

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
      Logger.debug(e);
    } else {
      response.status = Status.InternalServerError;
      Logger.error(e);
    }
  }
}
