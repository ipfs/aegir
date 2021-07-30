export = tasks;
declare const tasks: Listr<import("../types").GlobalOptions & import("../types").BuildOptions>;
declare namespace tasks {
    export { GlobalOptions, BuildOptions, Task };
}
import Listr = require("listr");
type GlobalOptions = import("../types").GlobalOptions;
type BuildOptions = import("../types").BuildOptions;
type Task = import("listr").ListrTaskWrapper;
//# sourceMappingURL=index.d.ts.map