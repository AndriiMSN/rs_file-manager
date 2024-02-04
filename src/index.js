import readline from 'readline';
import { chdir } from 'node:process';
import { homedir } from 'node:os';
import commands from './utils.js';

let username = '';
let usernameArgv = process.argv
  .slice(2)
  .find((el) => el.startsWith('--username='));
if (usernameArgv) {
  username = usernameArgv.split('=')[1];
}

chdir(homedir());

console.log(`Welcome to the File Manager${username ? ', ' + username : ''}!`);
commands.pwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', async (line) => {
  // console.log(line)
  const formattedLine = line.replace(/\s+/g, ' ').trim().split(' ');
  const command = formattedLine[0];
  const arg = formattedLine?.splice(1) || null;

  if (commands.hasOwnProperty(command)) {
    commands[command].call(this, arg, username);
  } else {
    console.log('Invalid input');
  }
  commands.pwd();
}).on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
