import { XMLParser } from "fast-xml-parser";
import { readConfig } from "src/config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { feeds, users } from "src/lib/db/schema";


export type DbFeed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type DbUser = typeof users.$inferSelect; // users is the table object in schema.ts

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};


export async function handlerAgg(cmdName: string, ...args: string[]) {
  console.log("Hit HandlerAgg");
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }
  await addFeed(args[0], args[1]);
}

export async function fetchFeed(feedURL:string){
  feedURL = "https://www.wagslane.dev/index.xml";
  console.log(`Fetching Feed: ${feedURL}`);
  //new URL()
  //Headers = 
  const response = await fetch(feedURL);
  //console.log(`response`);
  //console.log(response);
  //console.log(response.body);

  //console.log(`bodyResponse`);
  const bodyResponse = await new Response(response.body).text();
  //console.log(bodyResponse);

  //const data = await response.json();
  //console.log(`data`);
  //console.log(data);

  //console.log(`parserObj`);
  const parserObj = new XMLParser({processEntities: false});
  //console.log(parserObj);

  //console.log(`parsed JavaScript Obj`);
  const jsObj = parserObj.parse(bodyResponse);
  //console.log(jsObj);

  if(typeof(jsObj) === 'object' && 'rss' in jsObj && typeof(jsObj.rss) == 'object'){
    //console.log("jsObj is an object with rss that is an Object");
    const rss = jsObj.rss;
    if('channel' in rss && typeof(rss.channel) == 'object'){
      if('title' in rss.channel && typeof(rss.channel.title) == 'string'
        && 'link' in rss.channel && typeof(rss.channel.link) == 'string'
        && 'description' in rss.channel && typeof(rss.channel.description) == 'string') {
        const rssFeedObj: RSSFeed = {
          channel: {
            title: rss.channel.title,
            link: rss.channel.link,
            description: rss.channel.description,
            item: []
          }
        };

        if ('item' in rss.channel && Array.isArray(rss.channel.item)) {
          //console.log("channel.item is an Array");
          const items: [{}] = rss.channel.item;
          const rssItems: RSSItem[] = [];
          for (const item of items){
            if (typeof(item) == 'object' 
              && 'title' in item && typeof(item.title) == "string"
              && 'link' in item && typeof(item.link) == "string"
              && 'description' in item && typeof(item.description) == "string"
              && 'pubDate' in item && typeof(item.pubDate) == "string") {
              rssItems.push({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate
              });
            } else {
              //console.log(`invalid item:`);
              //console.log(item);
            }
          }
          rssFeedObj.channel.item = rssItems;
          //console.log("Full rssFeedObj");
          //console.log(rssFeedObj);
          return rssFeedObj;

        } else if ('item' in rss.channel && typeof(rss.channel.item) === 'object') {
          return rssFeedObj;
        } else {
          console.log("Who knows what the channel.item is, or if it even exists");
          throw Error("channel feed does not have items");
        }
      }
    }
  }
  throw Error("Failed parsing or feed does not have 'rss'");
}

export async function addFeed(name: string, url: string) {
  console.log("Hit addFeed");
  const configUser = await readConfig().currentUserName;
  const currentDbUser = await getUser(configUser);
  if (currentDbUser == undefined) {
    throw Error("Current User not found in the database!");
  }
  //console.log(`currentDbUser`);
  //console.log(currentDbUser);
  
  const feedResponse = await fetchFeed(url);
  //console.log("Feed fetched");
  //console.log(feedResponse);
  //console.log(feedResponse.channel.item);

  const createdFeed = await createFeed(name, url, currentDbUser.id);
  await printFeed(createdFeed, currentDbUser);
}

async function printFeed(feed: DbFeed, user: DbUser) {
  console.log("Hit printFeed");
  console.log(feed);
}