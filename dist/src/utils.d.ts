export var repoDirectory: string;
export function fromRoot(...p: string[]): string;
export function hasFile(...p: string[]): boolean;
export function fromAegir(...p: string[]): string;
export var hasTsconfig: boolean;
export namespace paths {
    export const dist: string;
    export const src: string;
    export const test: string;
    export { pkgPath as package };
}
export function parseJson(contents: string): any;
export function readJson(filePath: string | number | Buffer | import("url").URL): any;
export function getListrConfig(): {
    renderer: 'verbose';
};
export function exec(command: string, args: string[] | undefined, options?: any): execa.ExecaChildProcess<string>;
export function getElectron(): Promise<string>;
export function brotliSize(path: fs.PathLike): Promise<any>;
export function gzipSize(path: fs.PathLike): Promise<any>;
export function otp(): Promise<any>;
export const pkg: any;
declare const pkgPath: any;
import execa = require("execa");
import fs = require("fs-extra");
export {};
//# sourceMappingURL=utils.d.ts.map