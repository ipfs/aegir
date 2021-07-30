export = tasks;
/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").LintOptions} LintOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 *
 */
declare const tasks: Listr<import("./types").GlobalOptions & import("./types").LintOptions>;
declare namespace tasks {
    export { GlobalOptions, LintOptions, Task };
}
import Listr = require("listr");
type GlobalOptions = import("./types").GlobalOptions;
type LintOptions = import("./types").LintOptions;
type Task = import("listr").ListrTaskWrapper;
//# sourceMappingURL=lint.d.ts.map