export type Argv = import("yargs").Argv;
declare const command: string;
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {import("../types").TestOptions & import("../types").GlobalOptions} argv
 */
declare function handler(argv: import("../types").TestOptions & import("../types").GlobalOptions): Promise<void[]>;
/**
 * @param {import("../types").TestOptions & import("../types").GlobalOptions} argv
 */
declare function handler(argv: import("../types").TestOptions & import("../types").GlobalOptions): Promise<void[]>;
export {};
//# sourceMappingURL=test.d.ts.map