const fs = require('node:fs');
const path = require('node:path');
const { stdin, stdout } = require('node:process');
const readline = require('node:readline');

const FILENAME = 'output.txt';

const fullPath = path.join(__dirname, FILENAME);
const writeStream = fs.createWriteStream(fullPath);
const rl = readline.createInterface({ input: stdin });

stdout.write(`
  Please input some text to write into file: ${FILENAME}.
  Type 'exit' or press Ctrl+C to exit.\n
`);

rl.on('line', (line) => {
  if (line === 'exit') {
    process.exit();
  } else {
    writeStream.write(`${line}\n`);
  }
});

process.on('exit', () => {
  writeStream.close();
  stdout.write(`\nFile ${FILENAME} was created.\n`);
  stdout.write('Goodbye!\n');
});

process.on('SIGINT', () => process.exit());
