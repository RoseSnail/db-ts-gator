import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  try {
    const result = await db
      .insert(feeds)
      .values({
        name: feedName,
        url,
        userId,
      })
      .returning();
    return firstOrUndefined(result);
  } catch (err) {
    console.error("Insert error details:", err);
    throw err;
  }
}

//SELECT * FROM feeds;
export async function getFeeds() {
  return db.select().from(feeds);
}


export async function deleteFeeds() {
  await db.delete(feeds);
}