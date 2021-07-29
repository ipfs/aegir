export type ExecaOptions = import("execa").Options;
export type TestOptions = import('./../types').TestOptions;
export type GlobalOptions = import('./../types').GlobalOptions;
/**
 *
 * @param {TestOptions & GlobalOptions} opts
 * @param {ExecaOptions} execaOptions
 */
declare function run(opts: import("./../types").TestOptions & import("./../types").GlobalOptions, execaOptions?: import("execa").Options<string>): Promise<void[]>;
/**
 *
 * @param {TestOptions & GlobalOptions} opts
 * @param {ExecaOptions} execaOptions
 */
declare function run(opts: import("./../types").TestOptions & import("./../types").GlobalOptions, execaOptions?: import("execa").Options<string>): Promise<void[]>;
export {};
//# sourceMappingURL=index.d.ts.map