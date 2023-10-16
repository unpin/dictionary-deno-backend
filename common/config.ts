import { load } from "std/dotenv/mod.ts";

export const { DATABASE_URL, PORT, JWT_SECRET, LOG_LEVEL } = await load();
