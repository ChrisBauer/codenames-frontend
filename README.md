# Codenames

Horizon + Redux implementation of the popular guessing game ([Codenames](https://en.wikipedia.org/wiki/Codenames_(board_game)))


## Build and Run

There are two ways in which you can build and run the web app:

* Build once for (ready for ***Production***):
  * `$ npm run build`
  * `$ npm run build:serve`

  The last command will boot up HTTP server on `3003` port and serve `build/client` directory in a default browser

* Hot reloading via webpack middlewares:
  * `$ npm start`
  * Point your browser to http://localhost:3000/, page hot reloads automatically when there are changes
