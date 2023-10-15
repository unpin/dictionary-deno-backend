import { Application } from "oak";
import { PORT } from "./common/config.ts";
import { userRouter } from "./resources/user/user.router.ts";
import { wordRouter } from "./resources/words/word.router.ts";
import { cors } from "./middleware/cors.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

export const app = new Application();

app.use(errorHandler);
app.use(cors);
app.use(userRouter.routes(), userRouter.allowedMethods());
app.use(wordRouter.routes(), wordRouter.allowedMethods());

await app.listen({ port: Number(PORT) });
