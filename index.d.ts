declare module 'worker-logger' {
    import { Worker } from 'worker_threads';
    type listener = (value: any) => void
    type closeCallback = (WorkerName: string) => void
    export default class Logger {
        worker: Worker
        terminated: boolean
        terminating: boolean
        Name: string

        private handleWorkerMessage: listener
        private handleWorkerError: listener
        private handleWorkerExit: listener

        constructor(name: string)
        init(filenamePrefix: string): Logger
        log(message: string): Logger
        debug(message: string): Logger
        warn(message: string): Logger
        error(message: string): Logger
        close(cb: closeCallback): Logger
    }

}