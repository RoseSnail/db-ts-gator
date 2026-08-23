import { readConfig, setUser } from "./config";


function main() {
  //console.log("Hello, world!");

  const config = readConfig();
  //console.log(config);
  setUser("Thomas");
  const configAfter = readConfig();
  console.log(configAfter);
}

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

main();