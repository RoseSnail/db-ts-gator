import { deleteUsers } from "../lib/db/queries/users";
import { deleteFeeds } from "../lib/db/queries/feeds";


export async function handlerReset(_: string) {
  await deleteUsers();
  //await deleteFeeds();
  console.log("Database reset successfully!");
}
