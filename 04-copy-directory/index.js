const path = require('node:path');
const { copyFile, mkdir, readdir, rm } = require('node:fs/promises');

const DIRNAME = 'files';
const DEST_DIR = 'files-copy';

const copyDir = async (srcDir, destDir) => {
  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });

  const files = await readdir(srcDir, { withFileTypes: true });
  for (const file of files) {
    const srcFilePath = path.join(srcDir, file.name);
    const destFilePath = path.join(destDir, file.name);
    if (file.isFile()) {
      await copyFile(srcFilePath, destFilePath);
    }
    if (file.isDirectory()) {
      await copyDir(srcFilePath, destFilePath);
    }
  }
};

try {
  const srcDir = path.join(__dirname, DIRNAME);
  const destDir = path.join(__dirname, DEST_DIR);
  copyDir(srcDir, destDir);
} catch (err) {
  console.error(err.message);
}
