# Just enough docker until github gets a new node16 runner
# see: https://github.com/actions/runner/issues/772
FROM node:16-alpine
CMD [ "node", "node_modules/aegir/actions/bundle-size/dist/index.js" ]