import { Router } from "oak";
import {
  addDefinition,
  addWord,
  findWordById,
  getBookmarkedWords,
  removeDefinition,
  removeWord,
  reviewWords,
  searchWords,
  updateDefinition,
  updateWord,
} from "./word.controller.ts";
import { isAuth } from "../../middleware/isAuth.ts";

export const wordRouter = new Router();
wordRouter
  .use(isAuth)
  .get("/words/bookmarks", getBookmarkedWords)
  .get("/words/search/:query", searchWords)
  .get("/words/id/:wordId", findWordById)
  .get("/words/review", reviewWords)
  .post("/words", addWord)
  .post("/words/:wordId/definition", addDefinition)
  .patch("/words/:wordId", updateWord)
  .patch("/words/:wordId/definition/:definitionId", updateDefinition)
  .delete("/words/:wordId", removeWord)
  .delete("/words/:wordId/definition/:definitionId", removeDefinition);
