export type Argv = import("yargs").Argv;
export type Arguments = import("yargs").Arguments;
declare const command: string;
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {(import("../types").GlobalOptions & import("../types").BuildOptions) | undefined} argv
 */
declare function handler(argv: (import("../types").GlobalOptions & import("../types").BuildOptions) | undefined): Promise<import("../types").GlobalOptions & import("../types").BuildOptions>;
/**
 * @param {(import("../types").GlobalOptions & import("../types").BuildOptions) | undefined} argv
 */
declare function handler(argv: (import("../types").GlobalOptions & import("../types").BuildOptions) | undefined): Promise<import("../types").GlobalOptions & import("../types").BuildOptions>;
export {};
//# sourceMappingURL=build.d.ts.map