import { computePkgUrl } from './utils.js'

/**
 * @typedef {import('../../types').ReadmeStringGeneratorInputOptions} ReadmeStringGeneratorInputOptions
 * @type {Record<string, (options: Omit<ReadmeStringGeneratorInputOptions, 'repoUrl' | 'pkg'>) => string>}
 */
const BADGES = {
  libp2p: ({ repoOwner, repoName, defaultBranch }) => `
[![libp2p.io](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![Discuss](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg?style=flat-square)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/actions/workflow/status/${repoOwner}/${repoName}/js-test-and-release.yml?branch=${defaultBranch}&style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml?query=branch%3A${defaultBranch})
  `,
  ipfs: ({ repoOwner, repoName, defaultBranch }) => `
[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/actions/workflow/status/${repoOwner}/${repoName}/js-test-and-release.yml?branch=${defaultBranch}&style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml?query=branch%3A${defaultBranch})
  `,
  multiformats: ({ repoOwner, repoName, defaultBranch }) => `
[![multiformats.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://multiformats.io)
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/actions/workflow/status/${repoOwner}/${repoName}/js-test-and-release.yml?branch=${defaultBranch}&style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml?query=branch%3A${defaultBranch})
  `,
  default: ({ repoOwner, repoName, defaultBranch }) => `
[![codecov](https://img.shields.io/codecov/c/github/${repoOwner}/${repoName}.svg?style=flat-square)](https://codecov.io/gh/${repoOwner}/${repoName})
[![CI](https://img.shields.io/github/actions/workflow/status/${repoOwner}/${repoName}/js-test-and-release.yml?branch=${defaultBranch}&style=flat-square)](https://github.com/${repoOwner}/${repoName}/actions/workflows/js-test-and-release.yml?query=branch%3A${defaultBranch})
  `
}

/**
 * @type {import('../../types').ReadmeStringGenerator}
 */
export const HEADER = ({ defaultBranch, pkg, repoOwner, repoName, repoUrl }) => {
  const pkgUrl = computePkgUrl({ defaultBranch, pkg, repoUrl })
  return `
# [${pkg.name}](${pkgUrl}) <!-- omit in toc -->

${(BADGES[repoOwner] ?? BADGES.default)({ repoOwner, repoName, defaultBranch }).trim()}

> ${pkg.description}

## Table of contents <!-- omit in toc -->
`
}
