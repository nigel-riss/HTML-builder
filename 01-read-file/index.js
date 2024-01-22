const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const FILENAME = 'text.txt';

const fullPath = path.join(__dirname, FILENAME);
const readStream = fs.createReadStream(fullPath, 'utf-8');
readStream.pipe(stdout);
readStream.on('end', () => process.exit());
