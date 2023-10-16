import { Router } from "oak";
import {
  addDefinition,
  addWord,
  findWordById,
  getBookmarkedWords,
  incrementReviews,
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
  .post("/words", addWord)
  .post("/words/:wordId/definition", addDefinition)
  .get("/words/:wordId", findWordById)
  // TODO move bookmarks to /bookmarks route
  .get("/bookmarks", getBookmarkedWords)
  .get("/search/:query", searchWords)
  .get("/review", reviewWords)
  .patch("/words/:wordId", updateWord)
  .patch("/words/:wordId/definition/:definitionId", updateDefinition)
  .patch("/review/:wordId/:definitionId", incrementReviews)
  .delete("/words/:wordId", removeWord)
  .delete("/words/:wordId/definition/:definitionId", removeDefinition);
