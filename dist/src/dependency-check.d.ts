export type ExecaOptions = import("execa").Options;
export type GlobalOptions = import("./types").GlobalOptions;
export type DependencyCheckOptions = import("./types").DependencyCheckOptions;
/**
 * Check dependencies
 *
 * @param {GlobalOptions & DependencyCheckOptions} argv - Command line arguments passed to the process.
 * @param {ExecaOptions} [execaOptions] - execa options.
 */
export function check(argv: GlobalOptions & DependencyCheckOptions, execaOptions?: execa.Options<string> | undefined): execa.ExecaChildProcess<string>;
import execa = require("execa");
//# sourceMappingURL=dependency-check.d.ts.map