import { readConfig } from "src/config";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUser, getUsers } from "../lib/db/queries/users";
import { DbFeed, DbUser } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);

  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  console.log("Feed created successfully:");
  printFeed(feed, user);
}

function printFeed(feed: DbFeed, user: DbUser) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerListFeeds(_: string) {
  const users = await getUsers();
  const userIdName: Record<string, string> = {};
  for (const user of users) {
    userIdName[user.id] = user.name;
  }

  const feeds = await getFeeds();
  for (const feed of feeds) {
    //console.log(`* ID:            ${feed.id}`);
    //console.log(`* Created:       ${feed.createdAt}`);
    //console.log(`* Updated:       ${feed.updatedAt}`);
    //console.log(`* name:          ${feed.name}`);
    //console.log(`* URL:           ${feed.url}`);
    //console.log(`* User:          ${userIdName[feed.userId]}`);
    console.log(`(${feed.id}) * "${feed.name}" * ${feed.url} * ${userIdName[feed.userId]}`);
  }
}
