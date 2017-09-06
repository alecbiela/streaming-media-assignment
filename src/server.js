const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// main server handling function
const onRequest = (req, res) => {
  console.log(req.url);

  switch (req.url) {
    case '/':
      htmlHandler.getIndex(req, res, 1);
      break;
    case '/page2':
      htmlHandler.getIndex(req, res, 2);
      break;
    case '/page3':
      htmlHandler.getIndex(req, res, 3);
      break;
    case '/party.mp4':
      mediaHandler.loadFile(req, res, '../client/party.mp4', 'video/mp4');
      break;
    case '/bling.mp3':
      mediaHandler.loadFile(req, res, '../client/bling.mp3', 'audio/mpeg');
      break;
    case '/bird.mp4':
      mediaHandler.loadFile(req, res, '../client/bird.mp4', 'video/mp4');
      break;
    default:
      htmlHandler.getIndex(req, res);
      break;
  }
};

// create HTTP server and start listening
http.createServer(onRequest).listen(port);
console.log(`Listening on localhost:${port}`);
