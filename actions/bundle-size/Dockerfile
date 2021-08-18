# Just enough docker until github gets a new node16 runner
# see: https://github.com/actions/runner/issues/772
FROM node:16-alpine
COPY ./dist/index.js /bundle_size.js
CMD [ "node", "/bundle_size.js" ]
