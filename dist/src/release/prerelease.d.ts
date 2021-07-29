export = prerelease;
/**
 * Validate that all requirements are met before starting the release
 * - No dirty git
 * - github token for github release, if github release is enabled
 *
 * @param {{ ghrelease: boolean; ghtoken: string; }} opts
 */
declare function prerelease(opts: {
    ghrelease: boolean;
    ghtoken: string;
}): Promise<[void, void]>;
//# sourceMappingURL=prerelease.d.ts.map