/** @type {import("./src/types").PartialOptions} */
export default {
    docs: {
        entryPoint: 'utils'
    },
    dependencyCheck: {
        ignore: [
            'buffer',
            'c8',
            'conventional-changelog-conventionalcommits',
            'electron-mocha',
            'mocha',
            'npm-package-json-lint',
            'nyc',
            'path',
            'playwright-test',
            'react-native-test-runner',
            'semantic-release',
            'semantic-release-monorepo',
            'source-map-support',
            'typedoc-plugin-mdn-links',
            'typedoc-plugin-mermaid',
            'typedoc-plugin-missing-exports',
            'electron',
            'bytes',
            'pascalcase',
            'cspell'
        ]
    }
}
