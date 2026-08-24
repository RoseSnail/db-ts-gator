import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";


//INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

//SELECT * FROM users WHERE name '=' input;
export async function getUser(name: string) {
  const [result] = await db.select()
    .from(users)
    .where(eq(users.name, name));
  return result;
}

//SELECT * FROM users;
export async function getUsers(name: string) {
  const result = await db.select()
    .from(users);
  return result;
}

export async function truncateUsers(){
  const [result] = await db.execute(sql`TRUNCATE TABLE ${users};`);
  return result;
}