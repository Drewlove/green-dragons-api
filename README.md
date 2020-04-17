# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set Up: 
Use CLI for running commands listed below

### I. Clone Repo: Git Clone, npm install, .env variables
Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. In the recently moved .env file, rename the values of the following: MIGRATION_DB_NAME, DATABASE_URL, TEST_DATABASE_URL  
5. Edit the contents of the `package.json` to change "name" and "description"
6. Install the node dependencies `npm install`  
7. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`

### II. Create New Project Github Repo 
1. Open github and create a new repo
2. Follow the instructions, making the first commit and push of the new project to github
`git init`  
`git add . `  
`git commit -m "first commit"`  
`git remote add origin https://github.com/username/repo-name.git`  
`git push -u origin master`

### III. Initial API Tests
1. Type `npm run dev` to launch run API on local machine
2. Open Postman, set Headers `Key` - `Authorization`, `Value` - `Bearer 1234`. This should return `{ok: true}`  
*1234 is the default API_KEY specified in the .env file, this will eventually need to be changed

### IV. Create, Migrate and Seed Local Database
NOTE: The steps below create, migrate, and seed a database based off the default files from boilerplate-api. You will need to create new files for migrations and seeds, as well as /src folders, with router and service files, for each table.  
1. Open psql, `psql postgres`
2. Create databse, `create database name_of_database;`
3. Change default name of database in .env file MIGRATION_DB_NAME, DATABASE_URL, TEST_DATABASE_URL 
4. Migrate database with `npm run migrate` 
5. Seed database `psql -f ~/Projects/boilerplate-api/seeds/seed.all.sql boilerplate;`  
*Note that the file and database should be changed to match the current project file and database


### V. Deploy API to Heroku and Set API Token 
1. Add a new Heroku application with `heroku create`.   
*This will make a new git remote called "heroku"
2. Deploy to heroku with `git push heroku master`
3. Generate a new UUID (https://www.uuidgenerator.net/) to use as your production API key and copy it. Now we can set it in Heroku using the following command: `heroku config:set API_TOKEN=paste-your-token-here`   
4. Test that the API Key works in Postman, by entering `https://NAME-OF-APP-HERE.herokuapp.com/test`, and change the Headers to include: Key: `Authorization`, Value `Bearer UUID-Random-Text-Random-Numbers`
5. You can view the API Key on the heroku website, click on the name of your heroku app, go to settings, scroll down to Config Vars

### VI. Provision, Deploy and Migrate Database to Heroku
1. Provision the database, type `heroku addons:create heroku-postgresql:hobby-dev`.  
*hobby-dev is the heroku plan 
2. Create Database, first get the database url with `heroku pg:credentials:url`.  
* it should read something like `postgres://very_long_string_numbers_etc.`
3. Then connect with `psql <connection url>`  
4. You can connect to the heroku database, and run psql commands, with `heroku pg:psql` 
4. Migrate the database, `npm run migrate:production`.  
*the boilerplate-api project also has a `"predeploy": "npm audit && npm run migrate:production"` script, so typing `npm run deploy` will also migrate the database to heroku

### VII. Updating API


### VIII. Updating Database

## Updating
You should be updating both github and Heroku on a regular basis. 

Push new updates from your local machine to github to save your work remotely.
When ready to deploy updates, push updates from your local machine to heroku. 

