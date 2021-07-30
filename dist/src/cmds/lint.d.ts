export type Argv = import("yargs").Argv;
export type Arguments = import("yargs").Arguments;
declare const command: string;
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {(import("../types").GlobalOptions & import("../types").LintOptions) | undefined} argv
 */
declare function handler(argv: (import("../types").GlobalOptions & import("../types").LintOptions) | undefined): Promise<import("../types").GlobalOptions & import("../types").LintOptions>;
/**
 * @param {(import("../types").GlobalOptions & import("../types").LintOptions) | undefined} argv
 */
declare function handler(argv: (import("../types").GlobalOptions & import("../types").LintOptions) | undefined): Promise<import("../types").GlobalOptions & import("../types").LintOptions>;
export {};
//# sourceMappingURL=lint.d.ts.map