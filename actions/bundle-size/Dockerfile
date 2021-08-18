# Just enough docker until github gets a new node16 runner
# see: https://github.com/actions/runner/issues/772
FROM node:16-alpine
WORKDIR /github/workspace
ADD dist bundle_size_dist
#CMD [ "node", "bundle_size_dist/index.js" ]
CMD [ "ls", "-la" ]