import { workerData, parentPort } from 'worker_threads';
import { existsSync, createWriteStream } from 'fs';
import { resolve, join, } from 'path';
import chalk from 'chalk';
const date = new Date().toISOString().replace(/\:/g, '-',).replace(/[T\.]/g, '_');
const basename = workerData && workerData.prefix ? `${workerData.prefix}_${date}_log.txt` : `${date}_log.txt`;
const baseDir = resolve(workerData && workerData.folder ? workerData.folder : './logs');
if (!existsSync(baseDir)) {
  throw new Error("Logging directory not found:" + baseDir);
}
const fileName = join(baseDir, basename);
const logStream = createWriteStream(fileName, { flags: 'a' });
function logToConsole(message) {
  console.log(message);
}

function logToFile(message) {
  logStream.writable && logStream.write(`${message}\n`);
}

parentPort.on('message', (message) => {
  switch (message.type) {
    case 'log':
      logToConsole(message.data);
      logToFile(message.data);
      break;
    case 'warn':
      logToConsole(chalk.yellow(message.data));
      logToFile(message.data);
      break;
    case 'debug':
      logToConsole(chalk.green(message.data));
      logToFile(message.data);
      break;
    case 'error':
      logToConsole(chalk.redBright(message.data));
      logToFile(message.data);
      break;
    case 'close':
      logToConsole(chalk.green('closing log file|' + fileName));
      logStream.end();
      parentPort.postMessage('closed');
      break;
  }
});
const msg1 = 'Logging Initalised|File Name:' + fileName
logToFile(msg1);
logToConsole(chalk.green(msg1));