# Just enough docker until github gets a new node16 runner
# see: https://github.com/actions/runner/issues/772
FROM node:16-alpine
WORKDIR /github/workspace
COPY ./dist/index.js /github/workspace/bundle_size.js
#CMD [ "node", "/github/workspace/bundle_size_dist/index.js" ]
CMD ["ls", "-la", "/github/workspace"]
