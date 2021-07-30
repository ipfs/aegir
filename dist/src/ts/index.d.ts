declare function _exports(argv: GlobalOptions & TSOptions): Promise<void | execa.ExecaReturnValue<string>>;
export = _exports;
export type Argv = import("yargs").Argv;
export type Arguments = import("yargs").Arguments;
export type GlobalOptions = import("../types").GlobalOptions;
export type TSOptions = import("../types").TSOptions;
export type Options = {
    preset: "config" | "check" | "types" | undefined;
    /**
     * - Extra options to forward to the backend
     */
    forwardOptions: string[];
    /**
     * - Extra include files for the TS Config
     */
    extraInclude: string[];
    /**
     * - Typescript repo support.
     */
    tsRepo: boolean;
    /**
     * - copy .d.ts from
     */
    copyFrom: string;
    /**
     * - copy .d.ts to
     */
    copyTo: string;
};
import execa = require("execa");
//# sourceMappingURL=index.d.ts.map