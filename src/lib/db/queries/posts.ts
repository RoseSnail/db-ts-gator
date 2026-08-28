import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import { DbPosts, feedFollows, feeds, posts, users } from "../schema";
import { firstOrUndefined } from "./utils";
import { createFeedFollow } from "./feed_follows";

export async function createPost(
  url: string,
  feedId: string,
  publishedAt: Date,
  title: string|null,
  description: string|null,
) {
  try {
    const result = await db
      .insert(posts)
      .values({url, feedId, title, description, publishedAt})
      .returning();
    return firstOrUndefined(result);
  } catch (err) {
    console.error("Insert error details:", err);
    throw err;
  }
}

//SELECT * FROM feeds WHERE url '=' input (or id '=' input);
export async function getPost(url:string|null, id:string = "") {
  if (url != null) {
    const result = await db.select().from(posts).where(eq(posts.url, url));
    return firstOrUndefined(result);
  } else if (id != "") {
    const idResult = await db.select().from(posts).where(eq(posts.id, id));
    return firstOrUndefined(idResult);
  }
  throw Error("getPost() needs either a url or an id to be passed!");
}

export async function getPostsForUser(name:string|null, id:string = "", limit:number = 2) {
  if (name != null) {
    const result = await db.select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedId: posts.feedId,
        feedName: feeds.name,
      })
      .from(posts)
      .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
      .innerJoin(feeds, eq(feeds.id, posts.feedId))
      .innerJoin(users, eq(users.id, feedFollows.userId))
      .where(eq(users.name, name))
      .orderBy(sql`${posts.publishedAt} DESC`)
      .limit(limit);
    return result;
  } else if (id != "") {
    const idResult = await db.select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedId: posts.feedId,
        feedName: feeds.name,
      })
      .from(posts)
      .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
      .innerJoin(feeds, eq(feeds.id, posts.feedId))
      .where(eq(feedFollows.userId, id))
      .orderBy(sql`${posts.publishedAt} DESC`)
      .limit(limit);
    return idResult;
  }
  throw Error("getFeedFollowsForUser() needs either a name or an id to be passed!");
}