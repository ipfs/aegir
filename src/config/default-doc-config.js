export const defaultDocConfig = {
  publish: Boolean(process.env.CI),
  entryPoint: 'src/index.{js,ts}',
  message: 'docs: update documentation [skip ci]',
  user: 'aegir[bot]',
  email: 'aegir[bot]@users.noreply.github.com',
  directory: '.docs'
}
