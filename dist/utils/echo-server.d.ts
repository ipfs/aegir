/// <reference types="node" />
export = EchoServer;
/**
 * HTTP echo server for testing purposes.
 *
 * @example
 * ```js
 * const EchoServer = require('aegir/utils/echo-server')
 * const server = new EchoServer()
 * await server.start()
 *
 * // search params echo endpoint
 * const req = await fetch('http://127.0.0.1:3000/echo/query?test=one')
 * console.log(await req.text())
 *
 * // body echo endpoint
 * const req = await fetch('http://127.0.0.1:3000/echo', {
 *   method: 'POST',
 *   body: '{"key": "value"}'
 * })
 * console.log(await req.text())
 *
 * // redirect endpoint
 * const req = await fetch('http://127.0.0.1:3000/redirect?to=http://127.0.0.1:3000/echo')
 * console.log(await req.text())
 *
 * // download endpoint
 * const req = await fetch('http://127.0.0.1:3000/download?data=helloWorld')
 * console.log(await req.text())
 *
 * await server.stop()
 * ```
 */
declare class EchoServer {
    /**
     *
     * @param {Object} options - server options
     * @param {number} [options.port] - server port
     * @param {string} [options.host] - server host
     * @param {boolean} [options.findPort] - flag to check for ports
     */
    constructor(options?: {
        port?: number | undefined;
        host?: string | undefined;
        findPort?: boolean | undefined;
    });
    options: {
        port?: number | undefined;
        host?: string | undefined;
        findPort?: boolean | undefined;
    };
    port: number;
    host: string;
    started: boolean;
    server: http.Server;
    polka: polka.Polka;
    start(): Promise<EchoServer>;
    stop(): Promise<EchoServer>;
}
import http = require("http");
import polka = require("polka");
//# sourceMappingURL=echo-server.d.ts.map