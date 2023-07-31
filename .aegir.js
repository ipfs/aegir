/** @type {import("./src/types").PartialOptions} */
export default {
    docs: {
        entryPoint: 'utils'
    },
    dependencyCheck: {
        ignore: [
            '@achingbrain/semantic-release-monorepo',
            '@typescript-eslint/eslint-plugin',
            'buffer',
            'c8',
            'conventional-changelog-conventionalcommits',
            'electron-mocha-main',
            'mocha',
            'npm-package-json-lint',
            'nyc',
            'path',
            'playwright-test',
            'react-native-test-runner',
            'semantic-release',
            'source-map-support',
            'typedoc-plugin-mdn-links',
            'typedoc-plugin-missing-exports',
            'electron'
        ]
    }
}
