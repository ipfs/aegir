export const command: string;
export const desc: string;
export namespace builder {
    namespace repo {
        const describe: string;
        const type: string;
    }
    namespace branch {
        const describe_1: string;
        export { describe_1 as describe };
        const type_1: string;
        export { type_1 as type };
    }
    namespace moduleName {
        const describe_2: string;
        export { describe_2 as describe };
        const type_2: string;
        export { type_2 as type };
    }
    namespace deps {
        const describe_3: string;
        export { describe_3 as describe };
        export function coerce(val: string): Record<string, string>;
        const _default: {};
        export { _default as default };
    }
}
/**
 * @param {{ repo: string; branch: string; deps: any; }} argv
 */
export function handler(argv: {
    repo: string;
    branch: string;
    deps: any;
}): Promise<void>;
/**
 * @param {{ repo: string; branch: string; deps: any; }} argv
 */
export function handler(argv: {
    repo: string;
    branch: string;
    deps: any;
}): Promise<void>;
//# sourceMappingURL=test-dependant.d.ts.map