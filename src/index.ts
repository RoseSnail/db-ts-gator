import { readConfig, setUser } from "./config";


function main() {
  //console.log("Hello, world!");
  
  const config = readConfig();
  //console.log(config);
  setUser(config, "Thomas");
  const configAfter = readConfig();
  console.log(configAfter);
}

main();