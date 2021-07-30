export = release;
/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
 */
/**
 * Release command
 *
 * @param {GlobalOptions & ReleaseOptions} opts
 */
declare function release(opts: GlobalOptions & ReleaseOptions): Promise<{
    remote: string;
}>;
declare namespace release {
    export { ReleaseOptions, GlobalOptions };
}
type GlobalOptions = import('./../types').GlobalOptions;
type ReleaseOptions = import('./../types').ReleaseOptions;
//# sourceMappingURL=index.d.ts.map