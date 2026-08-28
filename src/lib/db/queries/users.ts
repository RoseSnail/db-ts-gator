import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";


//INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

//SELECT * FROM users WHERE name '=' input (or id '=' input);;
export async function getUser(name: string|null, id:string = "") {
  if (name != null) {
    const result = await db.select().from(users).where(eq(users.name, name));
    return firstOrUndefined(result);
  } else if (id != "") {
    const idResult = await db.select().from(users).where(eq(users.id, id));
    return firstOrUndefined(idResult);
  }
  throw Error("getUser() needs either a name or an id to be passed!");
}

export async function deleteUsers() {
  await db.delete(users);
}

//SELECT * FROM users;
export async function getUsers() {
  return db.select().from(users);
}

//export async function truncateUsers(){
//  const [result] = await db.execute(sql`TRUNCATE TABLE ${users};`);
//  return result;
//}