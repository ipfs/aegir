module.exports = {
    webpack: {
        devtool: 'eval'
    },
    entry: 'src/main.js',
    hooks: {
        async pre () {
            await Promise.resolve()

            return 'pre done async'
        },
        async post () {
            await Promise.resolve()

            return 'post done async'
        }
    }
};
