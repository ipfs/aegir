export = testNode;
/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('./../types').TestOptions} TestOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
 */
/**
 *
 * @param {TestOptions & GlobalOptions} argv
 * @param {ExecaOptions} execaOptions
 */
declare function testNode(argv: TestOptions & GlobalOptions, execaOptions: ExecaOptions): Promise<void>;
declare namespace testNode {
    export { ExecaOptions, TestOptions, GlobalOptions };
}
type TestOptions = import('./../types').TestOptions;
type GlobalOptions = import('./../types').GlobalOptions;
type ExecaOptions = import("execa").Options;
//# sourceMappingURL=node.d.ts.map