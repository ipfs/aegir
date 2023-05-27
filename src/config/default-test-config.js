export const defaultTestConfig = {
  build: true,
  runner: 'node',
  target: ['node', 'browser', 'webworker'],
  watch: false,
  files: [],
  timeout: 60000,
  grep: '',
  bail: false,
  progress: false,
  cov: false
}
