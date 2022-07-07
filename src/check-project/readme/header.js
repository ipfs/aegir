/**
 * @type {Record<string, (repoOwner: string, repoName: string, defaultBranch: string) => string>}
 */
const BADGES = {
  libp2p: (repoOwner, repoName, defaultBranch) => `
[![libp2p.io](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![IRC](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discuss](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg?style=flat-square)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/workflow/status/libp2p/js-libp2p-interfaces/test%20&%20maybe%20release/${defaultBranch}?style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml)
`,
  ipfs: (repoOwner, repoName, defaultBranch) => `
[![ipfs.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io)
[![IRC](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Discord](https://img.shields.io/discord/806902334369824788?style=flat-square)](https://discord.gg/ipfs)
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/workflow/status/libp2p/js-libp2p-interfaces/test%20&%20maybe%20release/${defaultBranch}?style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml)
`,
  multiformats: (repoOwner, repoName, defaultBranch) => `
[![multiformats.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://multiformats.io)
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/workflow/status/libp2p/js-libp2p-interfaces/test%20&%20maybe%20release/${defaultBranch}?style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml)
  `,
  default: (repoOwner, repoName, defaultBranch) => `
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/workflow/status/libp2p/js-libp2p-interfaces/test%20&%20maybe%20release/${defaultBranch}?style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml)
  `
}

/**
 * @param {*} pkg
 * @param {string} repoOwner
 * @param {string} repoName
 * @param {string} defaultBranch
 */
export const HEADER = (pkg, repoOwner, repoName, defaultBranch) => {
  return `
# ${pkg.name} <!-- omit in toc -->

${(BADGES[repoOwner] ?? BADGES.default)(repoOwner, repoName, defaultBranch).trim()}

> ${pkg.description}

## Table of contents <!-- omit in toc -->
`
}
