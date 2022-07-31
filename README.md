# CIS-550 Final Project: MySongsQL

## How to build the project locally

1. Download the project and all associated files. `cd` into the root of the project directory. From the main cis550-group-1 file directory in a terminal, `cd` into the server directory using `cd server`. From this directory, run `npm install` and then `npm run start`.

2. Once you have ensured that the server is running in this terminal, open a separate terminal, and then from the main cis550-group-1 file directory `cd` into the client directory using `cd client`. From this directory, run `npm install` and then `npm run start`. After the application has finished building it should automatically open up in your browser.

3. Our frontend is currently set up to communicate with our deployed backend on Heroku. To test locally, go to `client/src/config.json` and set prod to `false`, server_prefix to `"http"`, and server_host to `"127.0.0.1"`

4. In order to run tests, run `npm test` from within the server folder after running `npm install`

5. Frontend for our application is also deployed at [https://mysongsql.netlify.app/](https://mysongsql.netlify.app/), and backend is deployed at [https://mysongsql.herokuapp.com/](https://mysongsql.herokuapp.com/).
