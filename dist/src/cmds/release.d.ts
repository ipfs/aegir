export type Argv = import("yargs").Argv;
export type Arguments = import("yargs").Arguments;
declare const command: string;
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {import("../types").GlobalOptions & import("../types").ReleaseOptions} argv
 */
declare function handler(argv: import("../types").GlobalOptions & import("../types").ReleaseOptions): Promise<{
    remote: string;
}>;
/**
 * @param {import("../types").GlobalOptions & import("../types").ReleaseOptions} argv
 */
declare function handler(argv: import("../types").GlobalOptions & import("../types").ReleaseOptions): Promise<{
    remote: string;
}>;
export {};
//# sourceMappingURL=release.d.ts.map