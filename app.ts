import { Application } from "oak";
import { PORT } from "./common/config.ts";
import { userRouter } from "./resources/user/user.router.ts";
import { wordRouter } from "./resources/words/word.router.ts";
import { cors } from "./middleware/cors.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { Logger } from "./common/logger.ts";

export const app = new Application();

app.use(errorHandler);
app.use(cors);
app.use(userRouter.routes(), userRouter.allowedMethods());
app.use(wordRouter.routes(), wordRouter.allowedMethods());

app.addEventListener(
  "listen",
  () => void Logger.info(`Server listening on ${PORT}`),
);

Logger.info("Redeploying");

await app.listen({ port: Number(PORT) });
