module.exports = {
    test: {
        async before () {
            await Promise.resolve()

            return 'pre done async'
        },
        async after () {
            await Promise.resolve()

            return 'post done async'
        }
    }
};
