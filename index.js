
import dotenv from 'dotenv';
import WorkerLogger from './src/logs.js';
dotenv.config()
export default WorkerLogger
//#usage exmaple
// console.log('loaded index.js')
// let logger = new WorkerLogger('SERVER');
// logger.init()
//     .log('test logs')
//     .warn('warning logs')
//     .debug('debug logs')
//     .log('message with additonal data', { data: { Test: "SubProperty" }, User: "Property" });
// logger.close();
// logger.close((name) => { console.log('closed logger cb:'+name) });

// new clsLogger('server').init('server').log('test logs').close((name) => { console.log('closed logger cb:' + name) });
// new clsLogger('server').init('db').log('test logs').close((name) => { console.log('closed logger cb:' + name) });
// new clsLogger('server').init('web').log('test logs').close((name) => { console.log('closed logger cb:' + name) });
// new clsLogger('server').init('http').log('test logs').close((name) => { console.log('closed logger cb:' + name) });