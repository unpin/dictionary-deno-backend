import * as Log from "std/log/mod.ts";
import { LOG_LEVEL } from "./config.ts";

Log.setup({
  handlers: {
    console: new Log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: LOG_LEVEL as Log.LevelName,
      handlers: ["console"],
    },
  },
});

export const Logger = {
  debug: Log.debug,
  info: Log.info,
  warning: Log.warning,
  error: Log.error,
  critical: Log.critical,
};
