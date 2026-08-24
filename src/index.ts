import { Config, readConfig, setUser } from "./config";
import { createUser, getUser, getUsers, truncateUsers } from "./lib/db/queries/users";


//let globalConfig: Config;

async function main() {
  //console.log("Hello, world!");
  //globalConfig = readConfig();
  //console.log("Config");
  //console.log(globalConfig);

  const registry: CommandsRegistry = {};
  await registerCommand(registry, "login", handlerLogin);
  await registerCommand(registry, "register", handlerRegister);
  await registerCommand(registry, "reset", handlerTruncate);
  await registerCommand(registry, "users", handlerUsers);

  try{
    //console.log("process.argv:")
    //console.log( process.argv.slice(2) );
    const args = process.argv.slice(2);
    await runCommand(registry, args[0], ...args.slice(1));
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
//type CommandsRegistry:Record<string, CommandHandler> = {};
type CommandsRegistry = Record<string, CommandHandler>;

async function handlerTruncate(cmdName: string, ...args: string[]){
  if (!args || args.length < 1) {
    const response = await truncateUsers();
    if (response == undefined) {
      console.log("Database seuccessfully reset");
    }
  //  //throw Error("Login expects a single argument; the username");
  //  throw Error("a table name is required");
  } else {
    switch (args[0]){
      case 'users':
        console.log('Truncating Users');
        const response = await truncateUsers();
        console.log( response ? response : response);
        break;
      default:
        throw Error("Invalid table passed");
    }
  }
}

async function handlerLogin(cmdName: string, ...args: string[]){
  if (!args || args.length < 1) {
    //throw Error("Login expects a single argument; the username");
    throw Error("a username is required");
  }
  const existingUser = await getUser(args[0]);
  if (existingUser == undefined) {
    throw Error("user doesn't exist");
  }
  //globalConfig.currentUserName = args[0];
  setUser(args[0]);
  //console.log(globalConfig);
  //console.log(readConfig());
  console.log("The user has been set");
}

async function handlerRegister(cmdName: string, ...args: string[]){
  if (!args || args.length < 1) {
    throw Error("a name is required");
  }
  const existingUser = await getUser(args[0]);
  if (existingUser !== undefined) {
    throw Error("user already exists");
  }
  const response = await createUser(args[0]);
  //console.log(await response);
  await setUser(await response.name);
  
  console.log("The user was successfully created");
  console.log(await response);
}

async function handlerUsers(cmdName: string, ...args: string[]){
  const currentUserName = readConfig().currentUserName;
  const response = await getUsers(cmdName);
  for (const user of response){
    console.log(`* ${user.name}${user.name == currentUserName?' (current)':''}`);
  }
}

async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
  //console.log(`registerCommand: ${cmdName}`);
  registry[cmdName] = handler;
}
async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  if (!cmdName) {
    throw Error("not enough arguments were provided");
  }
  //console.log(`runCommand: ${cmdName}`);
  //console.log(args[0]);
  if (cmdName in registry) {
    //console.log(cmdName);
    await registry[cmdName](cmdName, ...args);
  }
}


main();