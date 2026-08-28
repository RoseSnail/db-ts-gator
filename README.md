Welcome to this gator CLI blog aggre-gator!
What you will need: (to run this gator CLI)
 - You will need to install Postgres, connect to the server (I used the psql client) and create database gator, and set the password for the postgres user of gator. This password, user, and the port for your postgres will be used for the connection string in the config's db_url. The form of the config connection string should look like this: "protocol://username:password@host:port/database", and I added "?sslmode=disable" to the end for so something like "postgres://username:password@localhost:5432/gator?sslmode=disable".


Here's how to setup your config file, and how to run gator
 - This program is expecting you to have a config file in a specific location. The config file originally is named ".gatorconfig.json" and is located at the os's home directory. If you wish to modify this, the function getConfigFilePath() defines both of these locations. You can change the configFileName or the return path is you have a different file or path for your configuration.
 - The config file has this specific form:
{
  "db_url": "connection_string_goes_here",
  "current_user_name": "username_goes_here"
}
and the current_user_name gets set and updated by the program.
Once all that is set, you should be able to run the program and setup the database with the command: npm run migrate


Here are the commands available in the CLI once it's setup. For each command it starts with 'npm run start' and then follows with the command desired to be run and any variables needed:

command -  variables  -  description
login     <username>  - sets the passed user to the Current User 
register  <username>  - registers a new user
reset                 - clears the database fields
users                 - prints the registered users
agg       <delaytime> - scrapes feeds and adds them to the database
addfeed
feeds
follow
following
unfollow
browse
  
