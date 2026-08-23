import { Config, readConfig, setUser } from "./config";


let globalConfig: Config;

function main() {
  //console.log("Hello, world!");
  //globalConfig = readConfig();
  //console.log("Config");
  //console.log(globalConfig);

  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  try{
    //console.log("process.argv:")
    //console.log( process.argv.slice(2) );
    const args = process.argv.slice(2);
    runCommand(registry, args[0], ...args.slice(1));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

type CommandHandler = (cmdName: string, ...args: string[]) => void;
//type CommandsRegistry:Record<string, CommandHandler> = {};
type CommandsRegistry = Record<string, CommandHandler>;

function handlerLogin(cmdName: string, ...args: string[]){
  if (!args || args.length < 1) {
    //throw Error("Login expects a single argument; the username");
    throw Error("a username is required");
  }
  //globalConfig.currentUserName = args[0];
  setUser(args[0]);
  //console.log(globalConfig);
  //console.log(readConfig());
  console.log("The user has been set");
}

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
  //console.log(`registerCommand: ${cmdName}`);
  registry[cmdName] = handler;
}
function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  if (!cmdName) {
    throw Error("not enough arguments were provided");
  }
  //console.log(`runCommand: ${cmdName}`);
  //console.log(args[0]);
  if (cmdName in registry) {
    //console.log(cmdName);
    registry[cmdName](cmdName, ...args);
  }
}


main();