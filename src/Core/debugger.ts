import debug from 'debug';

export type LogHandler = (message?: any, ...optionalParams: any[]) => void;

/**
 * @param {string} key
 *
 * @returns {LogHandler}
 */
export function createDebugger(key: string): LogHandler {
    return debug('hypestate:' + key) as LogHandler;
}