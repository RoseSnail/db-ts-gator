import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";


//INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

//SELECT * FROM users WHERE name '=' input;
export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
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