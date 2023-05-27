export const defaultLintConfig = {
  silent: false,
  fix: false,
  files: [
    '*.{js,ts}',
    'bin/**',
    'config/**/*.{js,ts}',
    'test/**/*.{js,ts}',
    'src/**/*.{js,ts}',
    'tasks/**/*.{js,ts}',
    'benchmarks/**/*.{js,ts}',
    'utils/**/*.{js,ts}',
    '!**/node_modules/**'
  ]
}
