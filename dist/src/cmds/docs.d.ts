export type Argv = import("yargs").Argv;
declare const command: string;
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {(import("../types").GlobalOptions & import("../types").DocsOptions) | undefined} argv
 */
declare function handler(argv: (import("../types").GlobalOptions & import("../types").DocsOptions) | undefined): Promise<import("../types").GlobalOptions & import("../types").DocsOptions>;
/**
 * @param {(import("../types").GlobalOptions & import("../types").DocsOptions) | undefined} argv
 */
declare function handler(argv: (import("../types").GlobalOptions & import("../types").DocsOptions) | undefined): Promise<import("../types").GlobalOptions & import("../types").DocsOptions>;
export {};
//# sourceMappingURL=docs.d.ts.map