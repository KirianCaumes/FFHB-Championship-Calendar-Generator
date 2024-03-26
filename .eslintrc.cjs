module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx'],
            },
            typescript: {
                alwaysTryTypes: true,
            },
        },
        jsdoc: {
            mode: 'typescript',
        },
    },
    extends: [
        'plugin:jsdoc/recommended',
        'airbnb',
        /**
         * Turns off all rules that are unnecessary or might conflict with Prettier.
         * Check conflict between Eslint and Prettier with: `npx eslint-config-prettier .eslintrc.js`.
         */
        'prettier',
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
    },
    plugins: ['jsdoc'],
    rules: {
        'import/order': ['error', { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'] }],
        'capitalized-comments': [
            'warn',
            'always',
            {
                ignorePattern: 'cspell',
            },
        ],
        camelcase: ['error'],
        curly: ['warn', 'all'],
        'max-len': ['warn', { code: 160 }],
        'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],
        'import/extensions': ['error', 'always'],
        'jsdoc/no-undefined-types': [
            'warn',
            {
                definedTypes: ['FfhbApiCompetitionListResult', 'FfhbApiAddressResult', 'FfhbApiJourneesResult', 'Record', 'QueryType'],
            },
        ],
        'jsdoc/check-tag-names': [
            'warn',
            {
                definedTags: ['debug'],
            },
        ],
        'jsdoc/require-jsdoc': [
            'warn',
            {
                require: {
                    ClassDeclaration: true,
                },
            },
        ],
        'jsdoc/valid-types': 'off',
        'jsdoc/newline-after-description': 'off',
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }], // Must be at the end
    },
}
