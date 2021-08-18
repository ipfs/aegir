# Just enough docker until github gets a new node16 runner
# see: https://github.com/actions/runner/issues/772
FROM node:16-alpine
WORKDIR /usr/src/app
ADD * /usr/src/app
RUN ls -la
CMD [ "node", "dist/index.js" ]