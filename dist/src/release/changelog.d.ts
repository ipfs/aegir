export = changelog;
/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('listr').ListrTaskWrapper} ListrTask
 */
/**
 *
 * @param {*} ctx
 * @param {ListrTask} task
 */
declare function changelog(ctx: any, task: ListrTask): Promise<void | undefined>;
declare namespace changelog {
    export { ReleaseOptions, ListrTask };
}
type ListrTask = import('listr').ListrTaskWrapper;
type ReleaseOptions = import('./../types').ReleaseOptions;
//# sourceMappingURL=changelog.d.ts.map