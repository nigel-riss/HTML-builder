const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} = require('node:fs/promises');

const OUTPUT_DIR = 'project-dist';
const TEMPLATE_FILE = 'template.html';
const OUTPUT_HTML_FILE = 'index.html';
const OUTPUT_STYLES_FILE = 'style.css';
const COMPONENTS_DIR = 'components';
const STYLES_DIR = 'styles';
const ASSETS_DIR = 'assets';

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

const createCSSBundle = async (stylesPath, outputPath) => {
  const writeStream = createWriteStream(outputPath);

  const files = await readdir(stylesPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(stylesPath, file.name);
    const fileExt = path.extname(filePath);
    if (!file.isFile() || fileExt !== '.css') continue;

    const readStream = createReadStream(filePath);
    readStream.pipe(writeStream);
  }
};

const buildHTML = async (componentsPath, outputPath) => {
  const componentFiles = await readdir(componentsPath, { withFileTypes: true });
  const templatePath = path.join(__dirname, TEMPLATE_FILE);

  let html = await readFile(templatePath, 'utf-8');

  for (const file of componentFiles) {
    const filePath = path.join(componentsPath, file.name);
    const fileExt = path.extname(filePath);

    if (!file.isFile() || fileExt !== '.html') continue;

    const componentName = path.parse(filePath).name;
    const componentHTML = await readFile(filePath, 'utf-8');
    html = html.replace(`{{${componentName}}}`, componentHTML);
  }

  const outputFilePath = path.join(outputPath, OUTPUT_HTML_FILE);
  await writeFile(outputFilePath, html);
};

const createBuild = async (srcDir, destDir) => {
  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });

  const componentsPath = path.join(srcDir, COMPONENTS_DIR);
  await buildHTML(componentsPath, destDir);

  const stylesDirPath = path.join(srcDir, STYLES_DIR);
  const stylesDestPath = path.join(destDir, OUTPUT_STYLES_FILE);
  await createCSSBundle(stylesDirPath, stylesDestPath);

  const assetsPath = path.resolve(srcDir, ASSETS_DIR);
  const assetsDestPath = path.resolve(destDir, ASSETS_DIR);
  await copyDir(assetsPath, assetsDestPath);
};

try {
  const destDir = path.resolve(__dirname, OUTPUT_DIR);
  const srcDir = path.resolve(__dirname, '.');
  createBuild(srcDir, destDir);
} catch (err) {
  console.error(err);
}
