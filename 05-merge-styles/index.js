const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const { readdir } = require('node:fs/promises');

const STYLES_DIR = 'styles';
const OUTPUT_DIR = 'project-dist';
const OUTPUT_FILE = 'bundle.css';

const createBundle = async (stylesPath, outputPath) => {
  let writeStream = createWriteStream(outputPath);

  const files = await readdir(stylesPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(stylesPath, file.name);
    const fileExt = path.extname(filePath);
    if (!file.isFile() || fileExt !== '.css') continue;

    const readStream = createReadStream(filePath);
    writeStream = readStream.pipe(writeStream);
  }
};

try {
  // Comment this for testing purposes
  const stylesPath = path.resolve(__dirname, STYLES_DIR);
  const outputPath = path.resolve(__dirname, OUTPUT_DIR, OUTPUT_FILE);

  // Uncomment this for testing purposes
  // const stylesPath = path.resolve(__dirname, 'test-files/styles');
  // const outputPath = path.resolve(__dirname, 'test-files', OUTPUT_FILE);

  createBundle(stylesPath, outputPath);
} catch (err) {
  console.error(err);
}
