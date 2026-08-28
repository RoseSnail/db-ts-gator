import { getPostsForUser } from "../lib/db/queries/posts";
import type { DbUser } from "../lib/db/schema";


export async function handlerBrowse(
  cmdName: string,
  user: DbUser,
  ...args: string[]
) {
  let limit = 2;
  if (args.length === 1) {
    let specifiedLimit = parseInt(args[0]);
    if (specifiedLimit) {
      limit = specifiedLimit;
    }
  }

  const posts = await getPostsForUser(null, user.id, limit);

  console.log(`Found ${posts.length} posts for user ${user.name}`);
  for (let post of posts) {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`--- ${post.title} ---`);
    console.log(`    ${post.description}`);
    console.log(`Link: ${post.url}`);
    console.log(`=====================================`);
  }
}
