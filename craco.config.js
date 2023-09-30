const path = require('path')

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    webpack: {
        configure: {
            resolve: {
                alias: {
                    // This will allow you to do require('src/path-to-file/') instead of doing relative path like this: require('../../../../assets/')
                    src: path.resolve(__dirname, 'src'),
                },
            },
        },
    },
}
