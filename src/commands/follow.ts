import { readConfig } from "src/config";
import { getFeed } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";
import { DbFeed, DbUser, DbFeedFollows } from "src/lib/db/schema";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";


export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const url = args[0];
  const feed = await getFeed(url);
  if (!feed) {
    throw new Error(`Feed ${url} not found`);
  }

  const feedFollowUserAndFeed = await createFeedFollow(user.id, feed.id);
  
  console.log(`* Successfully Followed *`);
  console.log(`* Feed name:     ${feed.name}`);
  console.log(`* Current User:  ${user.name}`);
}