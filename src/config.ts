import fs from "fs";  // Allows reading and writing of files
import os from "os";  // OS-related utility methods
import path from "path";  // utilities for working with file and dir paths


export type Config = {
  dbUrl: string;
  currentUserName: string;
};

// writes a Config object to the JSON file after setting the current_user_name field.
export function setUser(config: Config, userName: string) {
  config.currentUserName = userName;
  writeConfig(config);
}

// reads the JSON file found at ~/.gatorconfig.json and returns a Config object.
export function readConfig(): Config {
  const configFile = fs.readFileSync(getConfigFilePath(), "utf-8");  // It should read the file from the HOME directory,
  //console.log(`Raw Config from: ${getConfigFilePath()}`);
  //console.log(configFile);
  return validateConfig(JSON.parse(configFile));                                 // then decode the JSON string into a new Config object.
}

function getConfigFilePath(): string {
  const filename = ".gatorconfig.json";
  //return `${os.homedir()}/${filename}`;
  return path.join(os.homedir(), filename);
}

function writeConfig(cfg: Config): void {
  //console.log("Config Object:");
  //console.log(cfg);
  //console.log("File Formatted");
  const fileFormatted = configToFileFormat(cfg);
  //console.log(fileFormatted);
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(fileFormatted));
}
function configToFileFormat(config:Config) {
  return {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName
  }
}

function validateConfig(raw: any): Config {
  //console.log("raw:");
  //console.log(raw);
  if(raw && typeof raw === 'object' 
    && raw.hasOwnProperty("db_url") && typeof raw.db_url === 'string'
  ){ 
    return {
      dbUrl: raw.db_url,
      currentUserName: raw?.current_user_name ?? ""
    };
  }
  throw Error("file is not a valid config");
}

function camelToSnake(camel: string): string {
  return camel.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}
function snakeToCamel(snake:string): string {
  return snake.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
}

function fileFormatToConfig(raw:any): Config {
  if(raw && typeof raw === 'object' 
    && raw.hasOwnProperty("db_url") && typeof raw.db_url === 'string'
    && raw.hasOwnProperty("current_user_name") && typeof raw.current_user_name === 'string'
  ){ 
    return {
      dbUrl: raw.db_url,
      currentUserName: raw.current_user_name
    };
  }
  throw Error("file is not a valid config");
}

