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
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
    },
    plugins: ['jsdoc', 'react', 'react-hooks'],
    rules: {
        indent: ['error', 4, { ignoredNodes: ['TemplateLiteral'], SwitchCase: 1 }],
        semi: ['warn', 'never'],
        curly: ['warn', 'multi', 'consistent'],
        'template-curly-spacing': 'off', // Issue: https://stackoverflow.com/questions/48391913/eslint-error-cannot-read-property-range-of-null
        'max-len': ['warn', { code: 160 }],
        'comma-dangle': ['warn', 'always-multiline'],
        'nonblock-statement-body-position': ['warn', 'below'],
        'arrow-parens': ['warn', 'as-needed'],
        'function-paren-newline': ['error', 'consistent'],
        'jsdoc/no-undefined-types': ['warn', {
            definedTypes: [
                'FfhbApiCompetitionListResult',
                'FfhbApiAddressResult',
                'FfhbApiJourneesResult',
                'Record',
                'QueryType',
            ],
        }],
        'jsdoc/check-tag-names': ['warn', {
            definedTags: ['debug'],
        }],
        'jsdoc/require-jsdoc': ['warn', {
            require: {
                ClassDeclaration: true,
            },
        }],
        'jsdoc/valid-types': 'off',
        'jsdoc/newline-after-description': 'off',
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }], // Must be at the end
    },
}
