import { getFeed } from "../lib/db/queries/feeds";
import { DbUser } from "src/lib/db/schema";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed_follows";


export async function handlerFollow(cmdName: string, user: DbUser, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const url = args[0];
  const feed = await getFeed(url);
  if (!feed) {
    throw new Error(`Feed ${url} not found`);
  }

  const feedFollowUserAndFeed = await createFeedFollow(user.id, feed.id);
  if (feedFollowUserAndFeed) {
    console.log(`* Successfully Followed *`);
    console.log(`* Feed name:     ${feedFollowUserAndFeed.feedName}`);
    console.log(`* Current User:  ${feedFollowUserAndFeed.userName}`);
  } else {
    throw new Error(`New FeedFollow of ${url} for ${user.name} failed to be created`);
  }
}

export async function handlerFollowing(cmdName: string, user:DbUser) {
  const feedFollows = await getFeedFollowsForUser(user.name);
  //console.log(feedFollows);
  if (!feedFollows || feedFollows.length < 1) {
    console.log(`No follows found for ${user.name}`);
  } else {
    console.log(`* ${user.name} Currently Follows *`);
    for (const feed of feedFollows) {
      console.log(`* ${feed.feedName}`);
    }
  }
}

export async function handlerUnfollow(cmdName: string, user:DbUser, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  await deleteFeedFollow(user.name, args[0]);
  console.log(`${user.name} successfully unfollowed ${args[0]}`);
}