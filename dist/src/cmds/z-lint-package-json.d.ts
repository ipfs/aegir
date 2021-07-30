export type Argv = import("yargs").Argv;
import execa = require("execa");
declare const command: string;
declare const desc: string;
declare const aliases: string[];
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {{ [x: string]: any; _: string | any[]; }} argv
 */
declare function handler(argv: {
    [x: string]: any;
    _: string | any[];
}): execa.ExecaChildProcess<string>;
/**
 * @param {{ [x: string]: any; _: string | any[]; }} argv
 */
declare function handler(argv: {
    [x: string]: any;
    _: string | any[];
}): execa.ExecaChildProcess<string>;
export {};
//# sourceMappingURL=z-lint-package-json.d.ts.map