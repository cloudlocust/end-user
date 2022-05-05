const path = require('path')
const storybookDotenv = require('dotenv').config({
    path: path.resolve('.env.development'),
})
module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-create-react-app'],
    webpackFinal: async (config) => {
        //SOLUTION INSPIRED FROM https://github.com/storybookjs/storybook/issues/12270#issuecomment-897256202
        // ----------------------------------------
        // Manually inject environment variables
        // Note that otherwise, only `STORYBOOK_*` prefix env vars are supported
        // Ref: https://github.com/storybookjs/storybook/issues/12270
        const envVarsToInject = storybookDotenv.parsed
        const hasEnvVarsToInject = envVarsToInject && Object.keys(envVarsToInject).length > 0
        if (hasEnvVarsToInject) {
            const definePlugin = config.plugins.find((plgn) => plgn.definitions)

            if (definePlugin.definitions) {
                if (!definePlugin['process.env']) {
                    definePlugin['process.env'] = {}
                }
                Object.keys(envVarsToInject).forEach((key) => {
                    definePlugin['process.env'][key] = JSON.stringify(envVarsToInject[key])
                })
            }
        }

        // ----------------------------------------

        return config
    },
}
