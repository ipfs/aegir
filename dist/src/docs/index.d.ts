export = tasks;
declare const tasks: Listr<import("../types").GlobalOptions & import("../types").DocsOptions>;
declare namespace tasks {
    export { GlobalOptions, DocsOptions, Task, Options };
}
import Listr = require("listr");
type GlobalOptions = import("../types").GlobalOptions;
type DocsOptions = import("../types").DocsOptions;
type Task = import("listr").ListrTaskWrapper;
type Options = {
    /**
     * - Entry point for typedoc (defaults: 'src/index.js')
     */
    entryPoint: string;
    /**
     * - Extra options to forward to the backend
     */
    forwardOptions: string[];
};
//# sourceMappingURL=index.d.ts.map