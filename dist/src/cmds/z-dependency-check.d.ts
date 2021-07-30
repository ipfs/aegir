export type Argv = import("yargs").Argv;
declare const command: string;
declare const aliases: string[];
declare const desc: string;
declare function builder(yargs: import("yargs").Argv<any>): void;
/**
 * @param {any} argv
 */
declare function handler(argv: any): Promise<void>;
/**
 * @param {any} argv
 */
declare function handler(argv: any): Promise<void>;
export {};
//# sourceMappingURL=z-dependency-check.d.ts.map