const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const index2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const index3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const getIndex = (req, res, pNum) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  switch (pNum) {
    case 1: res.write(index); break;
    case 2: res.write(index2); break;
    case 3: res.write(index3); break;
    default: res.write(index); break;
  }
  res.end();
};

module.exports.getIndex = getIndex;
