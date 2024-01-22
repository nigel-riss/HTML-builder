const path = require('node:path');
const { readdir, stat } = require('node:fs/promises');

const DIRECTORY = 'secret-folder';

const fullDirPath = path.join(__dirname, DIRECTORY);

const printFileData = async (file) => {
  const filePath = path.join(fullDirPath, file.name);
  const fileName = path.parse(filePath).name;
  const fileExt = path.extname(filePath).slice(1);
  const fileSize = (await stat(filePath)).size;

  console.log(`${fileName} - ${fileExt} - ${fileSize}`);
};

const printFiles = async () => {
  const files = await readdir(fullDirPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      printFileData(file);
    }
  }
};

printFiles();
