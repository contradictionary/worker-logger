import { Worker } from 'worker_threads';
import { resolve } from 'path';
console.log('loaded logs.js')
export default class Logger {
    constructor(name) {
        this.worker = null;
        this.terminated = this.terminating = false;
        this.Name = name || 'Logger';
    }
    init(filenamePrefix) {
        if (this.worker) return;
        const workFile = process.env.LOGGER_WORKER_FILE || './src/worker.logger.js';
        this.worker = new Worker(resolve(workFile), { type: "module", workerData: { folder: process.env.LOGGER_LOG_PATH || './logs', prefix: filenamePrefix } });
        this.worker.on('message', this.handleWorkerMessage.bind(this));
        this.worker.on('error', this.handleWorkerError.bind(this));
        this.worker.on('exit', this.handleWorkerExit.bind(this));
        this.Name += ':' + this.worker.threadId;
        return this;
    }
    handleWorkerMessage(message) {
        if (message == 'closed') {
            this.worker.terminate()
            this.terminating = true;
        }
    }
    handleWorkerError(error) {
        console.error(`Worker ${this.Name} encountered an error:`);
        if (error.message) console.warn(error.message)
        if (error.filename) console.warn(error.filename)
        if (error.lineno) console.warn(error.lineno)
        if (error.stack) console.warn(error.stack)
    }
    handleWorkerExit(code) {
        this.terminated = true;
        if (this.terminating) {
            this.closeCB && this.closeCB(this.Name);
        }
    }
    log(message, data) {
        this.worker.postMessage({ type: 'log', name: this.Name, date: new Date().toJSON(), data: message, additional: data });
        return this;
    }
    debug(message, data) {
        this.worker.postMessage({ type: 'debug', name: this.Name, date: new Date().toJSON(), data: message, additional: data });
        return this;
    }
    warn(message, data) {
        this.worker.postMessage({ type: 'warn', name: this.Name, date: new Date().toJSON(), data: message, additional: data });
        return this;
    }
    error(message, data) {
        this.worker.postMessage({ type: 'error', name: this.Name, date: new Date().toJSON(), data: message, additional: data });
        return this;
    }
    close(cb) {
        this.worker.postMessage({ type: 'close' });
        this.closeCB = cb;
        return this;
    }
}