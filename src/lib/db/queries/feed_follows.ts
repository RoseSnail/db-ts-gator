import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeedFollow(
  userId: string,
  feedId: string,
) {
  try {
    const [result] = await db
      .insert(feedFollows)
      .values({ userId, feedId })
      .returning();
    const fullResult = await db
      .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name,
      })
      .from(feedFollows)
      .where(eq(feedFollows.id, result.id))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
    return firstOrUndefined(fullResult);
  } catch (err) {
    console.error("Insert error details:", err);
    throw err;
  }
}

export async function getFeedFollowFromId(
  feedFollowId: string|null,
  userId: string = "",
  feedId: string = "",
) {
  if (feedFollowId != null) {
    const result = await db
      .select()
      .from(feedFollows)
      .where(eq(feedFollows.id, feedFollowId));
    return firstOrUndefined(result);
  } else if (userId != "" && feedId != "") {
    const idResult = await db
      .select()
      .from(feedFollows)
      .where(and(
        eq(users.id, userId),
        eq(feeds.id, feedId)))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
    return firstOrUndefined(idResult)?.feed_follows;
  }
  throw Error("getFeedFollowFromId() needs either the feed_follows.id or the users.id and feeds.id to be passed!");
}

export async function getFeedFollowFromNameUrl(
  userName: string,
  feedUrl: string,
) {
  const result = await db
    .select()
    .from(feedFollows)
    .where(and(
      eq(users.name, userName),
      eq(feeds.url, feedUrl)))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
  return firstOrUndefined(result)?.feed_follows;
}

export async function getFeedFollowsForUser(name:string|null, id:string = "") {
  if (name != null) {
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name,
      })
      .from(feedFollows)
      .where(eq(users.name, name))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
    return result;
  } else if (id != "") {
    const idResult = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name,
      })
      .from(feedFollows)
      .where(eq(feedFollows.userId, id))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
    return idResult;
  }
  throw Error("getFeedFollowsForUser() needs either a name or an id to be passed!");
}

export async function deleteFeedFollow(userName:string, feedUrl:string) {
  const feedFollow = await getFeedFollowFromNameUrl(userName, feedUrl);

  if (feedFollow != undefined) {
    await db.delete(feedFollows).where(eq(feedFollows.id,feedFollow.id));
  } else {
    throw Error(`${userName} failed to unfollow ${feedUrl} for some reason.`);
  }
}