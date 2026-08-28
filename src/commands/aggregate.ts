import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss";
import { createPost } from "src/lib/db/queries/posts";


export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <time_delay>`);
  }

  const ms = parseDuration(args[0]);
  const minutes = Math.floor(ms/(1000 * 60));
  console.log(`Collecting feeds every ${minutes}m${Math.floor((ms / 1000) - (minutes * 60))}s`);

  await scrapeFeeds().catch(handleError);
  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, ms);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });

  //const feedURL = "https://www.wagslane.dev/index.xml";

  //const feedData = await fetchFeed(feedURL);
  //const feedDataStr = JSON.stringify(feedData, null, 2);
  //console.log(feedDataStr);
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    console.log("Failed to get the next feed to fetch");
    return;
  }
  const feedData = await fetchFeed(nextFeed.url);
  await markFeedFetched(nextFeed.id);
  console.log(` * Fetched ${feedData.channel.title} @ ${feedData.channel.link}`);
  for (const item of feedData.channel.item) {
    console.log(` *** ${item.title}`);

    const now = new Date();
    const newPost = await createPost(
      item.link,
      nextFeed.id,
      new Date(item.pubDate),
      item.title,
      item.description,
    );
  }
}

// returns a time string (1s, 1m, 1h) converted into milliseconds
function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  console.log(`parseDuration match:`);
  console.log(match);
  if (match) {
    let ms = 0;
    switch (match[2]){
      case 'ms': ms = Number(match[1]); break;
      case 's':  ms = (Number(match[1]) * 1000); break;
      case 'm':  ms = (Number(match[1]) * 60 * 1000); break;
      case 'h':  ms = (Number(match[1]) * 60 * 60 * 1000); break;
    }
    return ms;
  }
  return 0;
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}

// for testing only
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};