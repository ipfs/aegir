module.exports = {
    webpack: {
        devtool: 'eval'
    },
    entry: 'src/main.js',
    hooks: {
        pre() {
            return Promise.resolve('pre');
        },
        post() {
            return Promise.resolve('post');
        }
    }
};
