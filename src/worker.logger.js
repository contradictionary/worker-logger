import { workerData, parentPort } from 'worker_threads';
import { existsSync, createWriteStream } from 'fs';
import { resolve, join, } from 'path';
import * as chalk from 'chalk';
console.log('worker index.js')
const SOURCE_LOG_URL = process.env.LOGGER_SOURCEURL || "https://in.logs.betterstack.com";
const LogType = process.env.LOGGER_TYPE == "WEB" ? "WEB" : "FILE";
if (LogType == "WEB") {
  let sourceid = process.env.LOGGER_SOURCEID;
  if (!sourceid) throw new Error("Missing source id for WEB Logging, please added the sourceid in the env file!");
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sourceid };
  const SendLogData = async (message, level, dt, name, addtional) => {
    let body = JSON.stringify({ dt, message, level, name, ...addtional });
    return fetch(SOURCE_LOG_URL, { method: 'post', headers, body }).then(d => {
      console.log(d.status, d.statusText);
      d.text().then(txt => {
        console.log(txt);
      })
    }).catch(er => {
      console.error(er);
    })
  }
  parentPort.on('message', (message) => {
    typeof message == "string" ? SendLogData(message, 'log', new Date()) :
      SendLogData(message.data, message.type, message.date, message.name, message.addtional);
  });
} else {
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
        logToConsole(message.date ?? new Date().toJSON() + "|" + message.data);
        logToFile(message.date ?? new Date().toJSON() + "|" + message.data);
        break;
      case 'warn':
        logToConsole(message.date ?? new Date().toJSON() + "|" + chalk.yellow(message.data));
        logToFile(message.date ?? new Date().toJSON() + "|" + message.data);
        break;
      case 'debug':
        logToConsole(message.date ?? new Date().toJSON() + "|" + chalk.green(message.data));
        logToFile(message.date ?? new Date().toJSON() + "|" + message.data);
        break;
      case 'error':
        logToConsole(message.date ?? new Date().toJSON() + "|" + chalk.redBright(message.data));
        logToFile(message.date ?? new Date().toJSON() + "|" + message.data);
        break;
      case 'close':
        logToConsole(message.date ?? new Date().toJSON() + "|" + chalk.green('closing log file|' + fileName));
        logStream.end();
        parentPort.postMessage('closed');
        break;
    }
  });
  const msg1 = 'Logging Initalised|File Name:' + fileName
  logToFile(msg1);
  logToConsole(chalk.green(msg1));
}
