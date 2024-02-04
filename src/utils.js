import { chdir } from 'node:process';
import { createReadStream, createWriteStream } from 'node:fs';
import { readdir, readFile, open, rename, unlink } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { EOL, cpus, homedir, arch } from 'node:os';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

const { createHash } = await import('node:crypto');

export const pwd = () => {
  console.log(`You are currently in ${process.cwd()}`);
};
export const up = () => {
  try {
    chdir('../');
  } catch (err) {
    console.error(`Operation failed: ${err}`);
  }
};
export const cd = (arg) => {
  try {
    chdir(arg?.[0]);
  } catch (err) {
    console.error(`Operation failed: ${err}`);
  }
};

export const ls = async () => {
  try {
    const files = await readdir(process.cwd(), { withFileTypes: true });
    files.forEach((file, index) => {
      // console.log(file.name)
      files[index] = [
        files[index].name,
        file.isDirectory() ? 'directory' : 'file',
      ];
    });
    console.table(files);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const cat = async (arg) => {
  try {
    const content = await readFile(arg?.[0], { encoding: 'utf-8' });
    console.log(content);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const add = async (arg) => {
  let filehandle;
  try {
    filehandle = await open(arg?.[0], 'w');
  } catch (e) {
    console.log('Operation failed : ' + e);
  } finally {
    await filehandle?.close();
  }
};

export const rn = async (arg) => {
  try {
    await rename(arg?.[0], arg?.[1]);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const cp = async (arg) => {
  try {
    const readStream = createReadStream(arg?.[0]);
    const writeStream = createWriteStream(`${arg?.[1]}/${arg?.[0]}`);
    await pipeline(readStream, writeStream);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const mv = async (arg) => {
  try {
    const readStream = createReadStream(arg?.[0]);
    const writeStream = createWriteStream(`${arg?.[1]}/${arg?.[0]}`);
    await pipeline(readStream, writeStream);
    await unlink(arg?.[0]);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const rm = async (arg) => {
  try {
    await unlink(arg?.[0]);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const os = async (arg, username) => {
  if (!arg?.[0]?.startsWith('--')) {
    console.log('Params must started with --');
    return;
  }
  const params = {
    EOL: JSON.stringify(EOL),
    cpus: cpus(),
    homedir: homedir(),
    username: username,
    architecture: arch(),
  };

  const data = params[arg?.[0].slice(2)];
  if (!data) {
    console.log('unknown OS param');
  } else {
    console.log(data);
  }
};

export const hash = async (arg) => {
  try {
    const hash256 = createHash('sha256');
    const content = await readFile(arg?.[0]);
    hash256.update(content);
    console.log(hash256.digest('hex'));
  } catch (err) {
    console.log(err);
  }
};

export const compress = async (arg) => {
  try {
    const zip = createBrotliCompress();

    const srcStream = createReadStream(arg?.[0]);
    const dstStream = createWriteStream(arg?.[1]);

    await pipeline(srcStream, zip, dstStream);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

export const decompress = async (arg) => {
  try {
    const unzip = createBrotliDecompress();

    const srcStream = createReadStream(arg?.[0]);
    const dstStream = createWriteStream(arg?.[1]);

    await pipeline(srcStream, unzip, dstStream);
  } catch (e) {
    console.log('Operation failed : ' + e);
  }
};

const commands = {
  pwd,
  ls,
  add,
  hash,
  compress,
  cp,
  up,
  cd,
  decompress,
  cat,
  mv,
  rn,
  os,
  rm,
};

export default commands;
