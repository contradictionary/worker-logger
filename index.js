
import { config as dot_env_config } from 'dotenv';
dot_env_config();
import WorkerLogger from './src/logs.js';
export default WorkerLogger
//#usage exmaple

// let logger = new clsLogger('sample_logger');
// logger.init();
// logger.log('test logs');
// logger.close((name) => { console.log('closed logger cb:'+name) });

// new clsLogger('server').init('server').log('test logs').close((name) => { console.log('closed logger cb:' + name) });
// new clsLogger('server').init('db').log('test logs').close((name) => { console.log('closed logger cb:' + name) });
// new clsLogger('server').init('web').log('test logs').close((name) => { console.log('closed logger cb:' + name) });
// new clsLogger('server').init('http').log('test logs').close((name) => { console.log('closed logger cb:' + name) });