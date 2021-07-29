export type Argv = import("yargs").Argv;
export type Arguments = import("yargs").Arguments;
declare const command: string;
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {import("../types").GlobalOptions & import("../types").TSOptions} argv
 */
declare function handler(argv: import("../types").GlobalOptions & import("../types").TSOptions): Promise<void | import("execa").ExecaReturnValue<string>>;
/**
 * @param {import("../types").GlobalOptions & import("../types").TSOptions} argv
 */
declare function handler(argv: import("../types").GlobalOptions & import("../types").TSOptions): Promise<void | import("execa").ExecaReturnValue<string>>;
export {};
//# sourceMappingURL=ts.d.ts.map