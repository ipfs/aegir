export = bump;
/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('listr').ListrTaskWrapper} ListrTask
 */
/**
 * @param {{ type: ReleaseOptions["type"]; preid: ReleaseOptions["preid"]; }} ctx
 * @param {ListrTask} task
 */
declare function bump(ctx: {
    type: ReleaseOptions["type"];
    preid: ReleaseOptions["preid"];
}, task: ListrTask): Promise<void>;
declare namespace bump {
    export { ReleaseOptions, ListrTask };
}
type ReleaseOptions = import('./../types').ReleaseOptions;
type ListrTask = import('listr').ListrTaskWrapper;
//# sourceMappingURL=bump.d.ts.map