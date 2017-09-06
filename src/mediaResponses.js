const fs = require('fs');
const path = require('path');

// gets the chunk of bytes that we want to stream
const getByteChunk = (byteRange, totalSize) => {
  // transform request into usable start and end(if applicable)
  const positions = byteRange.replace(/bytes=/, '').split('-');
  let start = parseInt(positions[0], 10);

  const end = positions[1] ? parseInt(positions[1], 10) : totalSize - 1;
  if (start > end) start = end - 1;

  // send chunk back
  const chunksize = (end - start) + 1;
  return { start, end, chunksize };
};

// gets a file (accepts request, response, file path, and MIME type
const loadFile = (req, res, pth, type) => {
  // declare file variable so eslint will stop yelling
  let file = null;

  // callback for file loading
  const fileLoadCallback = (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404); // requested file doesn't exist
      }
      return res.end(err);
    }

    // check if the requested bytes are in the acceptable range
    let range = req.headers.range;
    if (!range) {
      range = 'bytes=0-';
    }

    // send byte range and size to get a chunk (object)
    const byteChunk = getByteChunk(range, stats.size);

    res.writeHead(206, {
      'Content-Range': `bytes ${byteChunk.start}-${byteChunk.end}/${stats.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': byteChunk.chunksize,
      'Content-Type': type,
    });

    // open a stream to pipe dem bytes

    const stream = fs.createReadStream(file, { start: byteChunk.start, end: byteChunk.end });

    stream.on('open', () => {
      stream.pipe(res);
    });

    stream.on('error', (streamErr) => {
      res.end(streamErr);
    });

    return stream;
  };

  // get the file path and load it
  file = path.resolve(__dirname, pth);
  fs.stat(file, fileLoadCallback);
};

module.exports.loadFile = loadFile;
