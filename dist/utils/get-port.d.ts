export = getPort;
/**
 * Helper to find an available port to put a server listening on.
 *
 * @example
 * ```js
 * const getPort = require('aegir/utils/get-port')
 * const port = await getPort(3000, '127.0.0.1')
 * // if 3000 is available returns 3000 if not returns a free port.
 *
 * ```
 *
 * @param {number} port
 * @param {string} host
 * @returns {Promise<number>}
 */
declare function getPort(port?: number, host?: string): Promise<number>;
//# sourceMappingURL=get-port.d.ts.map