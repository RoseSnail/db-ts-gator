import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds } from "../schema";
import { firstOrUndefined } from "./utils";
import { createFeedFollow } from "./feed_follows";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  try {
    const [result] = await db
      .insert(feeds)
      .values({
        name: feedName,
        url,
        userId,
      })
      .returning();
    const followup = await createFeedFollow(result.userId, result.id);
    return result;
  } catch (err) {
    console.error("Insert error details:", err);
    throw err;
  }
}

//SELECT * FROM feeds WHERE url '=' input (or id '=' input);
export async function getFeed(url:string|null, id:string = "") {
  if (url != null) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
  } else if (id != "") {
    const idResult = await db.select().from(feeds).where(eq(feeds.id, id));
    return firstOrUndefined(idResult);
  }
  throw Error("getFeed() needs either a url or an id to be passed!");
}

//SELECT * FROM feeds;
export async function getFeeds() {
  return db.select().from(feeds);
}

export async function deleteFeeds() {
  await db.delete(feeds);
}

//export async function getFeedFollowsForUser(userId: string) {
//  const result = await db.select()
//    .from(feedFollows)
//    .where(eq(feedFollows.userId, userId));
//  return result;
//}