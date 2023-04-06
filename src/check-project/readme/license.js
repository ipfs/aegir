/**
 * @typedef {import('../../types').LicenseGenerator} LicenseGenerator
 * @type {Record<string, LicenseGenerator>}
 */
const licenses = {
  ipfs: ({ repoOwner, repoName, repoUrl }) => `
## License

Licensed under either of

  * Apache 2.0, ([LICENSE-APACHE](${repoUrl}/LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
  * MIT ([LICENSE-MIT](${repoUrl}/LICENSE-MIT) / http://opensource.org/licenses/MIT)

## Contribute

Contributions welcome! Please check out [the issues](https://github.com/${repoOwner}/${repoName}/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
`,
  default: ({ repoUrl }) => `
## License

Licensed under either of

  * Apache 2.0, ([LICENSE-APACHE](${repoUrl}/LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
  * MIT ([LICENSE-MIT](${repoUrl}/LICENSE-MIT) / http://opensource.org/licenses/MIT)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
`
}

/**
 * @type {LicenseGenerator}
 */
export const LICENSE = ({ repoOwner, repoName, repoUrl }) => {
  return (licenses[repoOwner] ?? licenses.default)({ repoName, repoOwner, repoUrl })
}
