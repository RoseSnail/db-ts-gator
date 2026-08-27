import { db } from "..";
import { feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeedFollow(
  userId: string,
  feedId: string,
) {
  try {
    const result = await db
      .insert(feedFollows)
      .values({ userId, feedId })
      .returning();
    return firstOrUndefined(result);
  } catch (err) {
    console.error("Insert error details:", err);
    throw err;
  }
}