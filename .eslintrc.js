module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    plugins: ['css-modules', 'sonarjs', 'import'],
    extends: [
        'react-app',
        'react-app/jest',
        'plugin:jsdoc/recommended',
        'plugin:css-modules/recommended',
        'plugin:sonarjs/recommended',
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    ignorePatterns: ['tsconfig.json', 'package.json'],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        'no-console': 'warn',
        'react/prop-types': 'off',
        semi: [2, 'never'],
        // By default prettier raise an error, lets use warnings
        'prettier/prettier': 'warn',
        'jsdoc/require-returns-type': 0,
        'jsdoc/require-param-type': 0,
        'jsdoc/require-description-complete-sentence': 'warn',
        'jsdoc/require-description': 'warn',
        // Conflict with jsdoc
        'jsdoc/check-alignment': 0,
        'jsdoc/require-jsdoc': [
            'warn',
            {
                publicOnly: false,
                require: {
                    ClassDeclaration: true,
                    ClassExpression: true,
                    FunctionDeclaration: true,
                    ArrowFunctionExpression: true,
                    FunctionExpression: true,
                    MethodDefinition: true,
                },

                contexts: [
                    'ClassDeclaration',
                    'ClassProperty:not([accessibility=/(private|protected)/])',
                    'ExportNamedDeclaration:has(VariableDeclaration)',
                    'FunctionExpression',
                    'MethodDefinition:not([accessibility=/(private|protected)/]) > FunctionExpression',
                    // we need to precise AST needed to make them required
                    // https://github.com/gajus/eslint-plugin-jsdoc/issues/496#issuecomment-591204300
                    'TSEnumDeclaration',
                    'TSInterfaceDeclaration',
                    'TSPropertySignature',
                    'TSMethodSignature',
                    // This is required for ts type but it causes problem in nested object because its duplicates
                    // documentation, lets just deactivate it in nested object in types.
                    'TSTypeLiteral',
                    'TSEnumMember',
                    'TSTypeAliasDeclaration',
                ],
            },
        ],
        'import/no-cycle': ['error', { maxDepth: '∞', ignoreExternal: true }],
    },
    // overrides: [
    //     {
    //         files: ["**/*.ts?(x)"],
    //         rules: {
    //         },
    //     },
    // ],
}
