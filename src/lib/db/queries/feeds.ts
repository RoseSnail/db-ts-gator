import { db } from "..";
import { feeds } from "../schema";


//INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
export async function createFeed(name: string, url:string, userId: string) {
  try {
    const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
    return result;
  } catch (err) {
    console.error("Insert error details:", err);
    throw err;
  }
}

export async function deleteFeeds() {
  await db.delete(feeds);
}