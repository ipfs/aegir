export = publish;
/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('listr').ListrTaskWrapper} ListrTask
 */
/**
 * @param {{ distTag: ReleaseOptions["distTag"], type: ReleaseOptions["type"] }} ctx
 * @param {ListrTask} task
 */
declare function publish(ctx: {
    distTag: ReleaseOptions["distTag"];
    type: ReleaseOptions["type"];
}, task: ListrTask): Promise<execa.ExecaReturnValue<string>>;
declare namespace publish {
    export { ReleaseOptions, ListrTask };
}
type ReleaseOptions = import('./../types').ReleaseOptions;
type ListrTask = import('listr').ListrTaskWrapper;
import execa = require("execa");
//# sourceMappingURL=publish.d.ts.map