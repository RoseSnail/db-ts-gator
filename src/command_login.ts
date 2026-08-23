import { setUser } from "./config";


export function handlerLogin(cmdName: string, ...args:string[]) {
  if (!args || args.length != 1) {
    throw Error("Login expects a single argument; the username");
  }
  setUser(args[0]);
  console.log("The user has been set");
}