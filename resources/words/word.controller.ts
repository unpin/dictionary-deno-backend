import { Context, RouterContext, Status } from "oak";
import { Word, WordDefinition, WordInterface } from "./word.model.ts";
import { ObjectId } from "mongo";

export async function addWord(ctx: Context) {
  const { _id } = ctx.state.payload;
  const body = await ctx.request.body().value as WordInterface;

  const newDoc: Omit<WordInterface, "_id"> = {
    userId: new ObjectId(_id),
    word: body.word,
    definitions: [],
  };

  if (Array.isArray(body.definitions)) {
    body.definitions.forEach((def: WordDefinition) => {
      if (def.meaning) {
        newDoc.definitions.push({
          _id: new ObjectId(),
          meaning: def.meaning,
          examples: def.examples || [],
          reviews: 0,
        });
      }
    });
  }

  const createdId = await Word.create(newDoc);
  ctx.response.status = Status.Created;
  ctx.response.body = { _id: createdId };
}
// TODO add pagination
export async function searchWords(ctx: RouterContext<string>) {
  let { query } = ctx.params;
  query = query.replaceAll(/[\(\)]/g, ".*");
  const pattern = new RegExp(`^${query}`, "i");
  const words = await Word.findMany({
    word: { $regex: pattern },
  }, { limit: 15 });
  ctx.response.body = words;
}

export async function findWordById(ctx: RouterContext<string>) {
  const { wordId } = ctx.params;
  const word = await Word.findOne({ _id: new ObjectId(wordId) });
  if (!word) return ctx.response.status = Status.NotFound;
  ctx.response.body = word;
}

export async function updateWord(ctx: RouterContext<string>) {
  const { wordId } = ctx.params;
  const { word } = await ctx.request.body({ type: "json" }).value;

  const update = {
    $set: { word },
  };

  const updated = await Word.updateOne({ _id: new ObjectId(wordId) }, update);

  ctx.response.status = Status.OK;
  ctx.response.body = updated;
}

export async function getBookmarkedWords(ctx: Context) {
  const { _id } = ctx.state.payload;

  const page = Number(ctx.request.url.searchParams.get("page")) || 1;
  const limit = Number(ctx.request.url.searchParams.get("limit")) || 10;

  ctx.response.body = await Word.findMany({ userId: new ObjectId(_id) }, {
    limit,
    skip: (page - 1) * limit,
  });
}

export async function addDefinition(ctx: RouterContext<string>) {
  const { _id } = ctx.state.payload;
  const { wordId } = ctx.params;
  const data = await ctx.request.body().value;
  const definition = {
    _id: new ObjectId(),
    meaning: data.meaning,
    examples: [data.examples],
    reviews: 0,
  };
  const res = await Word.updateOne({
    _id: new ObjectId(wordId),
    userId: new ObjectId(_id),
  }, {
    $push: {
      definitions: definition,
    },
  });
  ctx.response.body = res;
}

export async function updateDefinition(ctx: RouterContext<string>) {
  const { wordId, definitionId } = ctx.params;
  const { meaning, example } = await ctx.request.body().value;
  const res = await Word.updateOne({
    _id: new ObjectId(wordId),
    "definitions._id": new ObjectId(definitionId),
  }, {
    $set: {
      "definitions.$.meaning": meaning,
      "definitions.$.example": example,
    },
  });
  ctx.response.body = res;
}

export async function removeWord(ctx: RouterContext<string>) {
  const { wordId } = ctx.params;
  const deleted = await Word.deleteOne({ _id: new ObjectId(wordId) });
  if (deleted) {
    return ctx.response.status = Status.OK;
  }
  ctx.response.status = Status.NotFound;
}

export async function removeDefinition(ctx: RouterContext<string>) {
  const { wordId, definitionId } = ctx.params;
  const res = await Word.updateOne({
    _id: new ObjectId(wordId),
  }, {
    $pull: { definitions: { _id: new ObjectId(definitionId) } },
  });
  ctx.response.body = res;
}

export async function reviewWords(ctx: RouterContext<string>) {
  const WORDS_REVIEW_LIMIT = 10;
  const { _id } = ctx.state.payload;
  const words = await Word.aggregate([
    {
      $match: {
        userId: new ObjectId(_id),
      },
    },
    {
      $unwind: {
        path: "$definitions",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $sort: { "definitions.reviews": 1 },
    },
    {
      $limit: WORDS_REVIEW_LIMIT,
    },
    { $project: { userId: 0, "definitions.reviews": 0 } },
  ]).toArray();
  ctx.response.body = words;
}

export async function incrementReviews(ctx: RouterContext<string>) {
  const { wordId, definitionId } = ctx.params;
  const res = await Word.updateOne({
    _id: new ObjectId(wordId),
    "definitions._id": new ObjectId(definitionId),
  }, {
    $inc: {
      "definitions.$.reviews": 1,
    },
  });
  ctx.response.body = res;
}
