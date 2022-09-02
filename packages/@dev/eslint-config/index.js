// Based on
// * https://github.com/facebook/create-react-app/blob/3c2f2d4b1f2726cc810b443044b5a65b225cd5ca/packages/eslint-config-react-app/index.js
// * https://github.com/google/eslint-config-google/blob/76b90900b143de061b0020637e1e24251f6199e5/index.js

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.
const confusingBrowserGlobals = require('confusing-browser-globals')

/**
 * @type {import('./types').ESLintConfig}
 */
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
    babelOptions: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
  plugins: [
    'codegen',
    'eslint-comments',
    'import',
    'promise',
    'unicorn',
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: '17.0.2',
    },
  },

  overrides: [
    // TODO: Inline configs once `eslint-find-rules` has support for overrides
    // https://github.com/sarbbottam/eslint-find-rules/issues/317
    {
      files: ['**/*.{ts,tsx}'],
      extends: ['./typescript'],
    },
    {
      files: [
        '**/__{mocks,tests}__/**/*.{js,ts,tsx}',
        '**/*.{spec,test}.{js,ts,tsx}',
      ],
      extends: ['./jest'],
    },
  ],

  rules: {
    // The rules below are listed in the order they appear on the eslint
    // rules page. All rules are listed to make it easier to keep in sync
    // as new ESLint rules are added.
    // http://eslint.org/docs/rules/

    // Possible Errors
    // http://eslint.org/docs/rules/#possible-errors
    'for-direction': 'off',
    'getter-return': 'error', // eslint:recommended
    'no-async-promise-executor': 'error', // eslint:recommended
    'no-await-in-loop': 'off',
    'no-compare-neg-zero': 'error', // eslint:recommended
    'no-cond-assign': ['error', 'except-parens'], // eslint:recommended
    'no-console': 'off', // eslint:recommended
    'no-constant-binary-expression': 'error',
    'no-constant-condition': 'error', // eslint:recommended
    'no-control-regex': 'error', // eslint:recommended
    'no-debugger': 'error', // eslint:recommended
    'no-dupe-args': 'error', // eslint:recommended
    'no-dupe-else-if': 'error', // eslint:recommended
    'no-dupe-keys': 'error', // eslint:recommended
    'no-duplicate-case': 'error', // eslint:recommended
    'no-empty-character-class': 'error', // eslint:recommended
    'no-empty': 'error', // eslint:recommended
    'no-ex-assign': 'error', // eslint:recommended
    'no-extra-boolean-cast': 'error', // eslint:recommended
    'no-extra-parens': 'off', // `prettier` already handles this
    'no-extra-semi': 'off', // eslint:recommended, `prettier` already handles this
    'no-func-assign': 'error', // eslint:recommended
    'no-import-assign': 'error', // eslint:recommended
    'no-inner-declarations': 'error', // eslint:recommended
    'no-invalid-regexp': 'error', // eslint:recommended
    'no-irregular-whitespace': 'error', // eslint:recommended
    'no-misleading-character-class': 'error', // eslint:recommended
    'no-obj-calls': 'error', // eslint:recommended
    'no-promise-executor-return': 'off',
    'no-prototype-builtins': 'off',
    'no-regex-spaces': 'error', // eslint:recommended
    'no-setter-return': 'error', // eslint:recommended
    'no-sparse-arrays': 'error', // eslint:recommended
    'no-template-curly-in-string': 'off',
    'no-unexpected-multiline': 'off', // eslint:recommended, `prettier` already handles this
    'no-unreachable-loop': 'off',
    'no-unreachable': 'error', // eslint:recommended
    'no-unsafe-finally': 'error', // eslint:recommended
    'no-unsafe-negation': 'off',
    'no-unsafe-optional-chaining': 'error', // eslint:recommended
    'no-unused-private-class-members': 'off',
    'no-useless-backreference': 'off', // eslint:recommended
    'require-atomic-updates': 'off',
    'require-unicode-regexp': 'off',
    'use-isnan': 'error', // eslint:recommended
    'valid-jsdoc': 'off',
    'valid-typeof': 'error', // eslint:recommended

    // Suggestions
    // http://eslint.org/docs/rules/#suggestions
    'accessor-pairs': 'off',
    'array-callback-return': 'error',
    'block-scoped-var': 'off',
    'class-methods-use-this': 'off',
    complexity: 'off',
    'consistent-return': 'off',
    curly: ['warn', 'all'],
    'default-case': 'off',
    'default-case-last': 'error',
    'default-param-last': 'off',
    'dot-location': 'off', // `prettier` already handles this
    'dot-notation': 'off',
    eqeqeq: ['error', 'smart'],
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'init-declarations': 'off',
    'max-classes-per-file': 'off',
    'no-alert': 'off',
    'no-caller': 'error',
    'no-case-declarations': 'error', // eslint:recommended
    'no-constructor-return': 'error',
    'no-delete-var': 'error', // eslint:recommended
    'no-div-regex': 'off',
    'no-else-return': 'off',
    'no-empty-function': 'off',
    'no-empty-pattern': 'error', // eslint:recommended
    'no-eq-null': 'off',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-fallthrough': 'error', // eslint:recommended
    'no-floating-decimal': 'off', // `prettier` already handles this
    'no-global-assign': 'off',
    'no-implicit-coercion': 'off',
    'no-implicit-globals': 'off',
    'no-implied-eval': 'error',
    'no-invalid-this': 'off',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': ['error', {allowLoop: true, allowSwitch: false}],
    'no-lone-blocks': 'error',
    'no-loop-func': 'off',
    'no-magic-numbers': 'off',
    'no-multi-spaces': 'off', // `prettier` already handles this
    'no-multi-str': 'error',
    'no-new-func': 'off',
    'no-new-wrappers': 'error',
    'no-new': 'off',
    'no-nonoctal-decimal-escape': 'off', // eslint:recommended
    'no-octal': 'error', // eslint:recommended
    'no-octal-escape': 'off',
    'no-param-reassign': 'off',
    'no-proto': 'off',
    'no-redeclare': 'error', // eslint:recommended
    'no-restricted-properties': 'off',
    'no-restricted-globals': [
      'error',
      'alert',
      'prompt',
      ...confusingBrowserGlobals,
    ],
    'no-return-assign': 'off',
    'no-return-await': 'off',
    'no-script-url': 'off',
    'no-self-assign': 'error', // eslint:recommended
    'no-self-compare': 'off',
    'no-sequences': 'error',
    'no-shadow': 'warn',
    'no-shadow-restricted-names': 'error',
    'no-throw-literal': 'error', // eslint:recommended
    'no-undef': 'error', // eslint:recommended
    'no-undef-init': 'off',
    'no-undefined': 'off',
    'no-unmodified-loop-condition': 'off',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'no-unused-labels': 'error', // eslint:recommended
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ], // eslint:recommended
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    'no-useless-call': 'off',
    'no-useless-catch': 'off',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-useless-return': 'off',
    'no-void': 'off',
    'no-warning-comments': 'off',
    'no-with': 'error',
    'prefer-named-capture-group': 'off',
    'prefer-object-has-own': 'warn',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'off',
    radix: 'off',
    'require-await': 'off',
    strict: 'off',
    'vars-on-top': 'off',
    'wrap-iife': 'off',
    yoda: 'off',

    // Layout & Formatting
    // https://eslint.org/docs/rules/#layout-formatting
    'array-bracket-newline': 'off', // eslint:recommended, `prettier` already handles this
    'array-bracket-spacing': 'off', // `prettier` already handles this
    'array-element-newline': 'off', // eslint:recommended, `prettier` already handles this
    'block-spacing': 'off', // `prettier` already handles this
    'brace-style': 'off', // `prettier` already handles this
    camelcase: 'off',
    'capitalized-comments': 'off',
    'comma-dangle': 'off', // `prettier` already handles this
    'comma-spacing': 'off', // `prettier` already handles this
    'comma-style': 'off', // `prettier` already handles this
    'computed-property-spacing': 'off', // prretier
    'consistent-this': 'off',
    'eol-last': 'off', // `prettier` already handles this
    'func-call-spacing': 'off', // `prettier` already handles this
    'func-name-matching': 'off',
    'func-names': 'off',
    'func-style': 'off',
    'function-call-argument-newline': 'off', // `prettier` already handles this
    'function-paren-newline': 'off', // `prettier` already handles this
    'id-blacklist': 'off',
    'id-denylist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'implicit-arrow-linebreak': 'off', // `prettier` already handles this
    indent: 'off', // `prettier` already handles this
    'jsx-quotes': 'off', // `prettier` already handles this
    'key-spacing': 'off', // `prettier` already handles this
    'keyword-spacing': 'off', // `prettier` already handles this
    'line-comment-position': 'off',
    'linebreak-style': 'off', // `prettier` already handles this
    'lines-around-comment': 'off', // `prettier` already handles this
    'lines-between-class-members': 'off',
    'max-depth': 'off',
    'max-len': 'off', // `prettier` already handles this
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'max-nested-callbacks': 'off',
    'max-params': 'off',
    'max-statements': 'off',
    'max-statements-per-line': 'off',
    'multiline-comment-style': 'off',
    'multiline-ternary': 'off', // `prettier` already handles this
    'new-cap': 'off',
    'new-parens': 'off', // `prettier` already handles this
    'newline-per-chained-call': 'off', // `prettier` already handles this
    'no-array-constructor': 'error',
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-inline-comments': 'off',
    'no-lonely-if': 'off',
    'no-mixed-operators': 'off', // `prettier` already handles this
    'no-mixed-spaces-and-tabs': 'off', // eslint:recommended, `prettier` already handles this
    'no-multi-assign': 'off',
    'no-multiple-empty-lines': 'off', // `prettier` already handles this
    'no-negated-condition': 'off',
    'no-nested-ternary': 'off',
    'no-new-object': 'error',
    'no-plusplus': 'off',
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-tabs': 'off', // `prettier` already handles this
    'no-ternary': 'off',
    'no-trailing-spaces': 'off', // `prettier` already handles this
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': 'off',
    'no-whitespace-before-property': 'off', // `prettier` already handles this
    'nonblock-statement-body-position': 'off', // `prettier` already handles this
    'object-curly-newline': 'off', // `prettier` already handles this
    'object-curly-spacing': 'off', // `prettier` already handles this
    'object-property-newline': 'off', // `prettier` already handles this
    'one-var': [
      'error',
      {
        var: 'never',
        let: 'never',
        const: 'never',
      },
    ],
    'one-var-declaration-per-line': 'off', // `prettier` already handles this
    'operator-assignment': 'off',
    'operator-linebreak': 'off', // `prettier` already handles this
    'padded-blocks': 'off', // `prettier` already handles this
    'padding-line-between-statements': 'off',
    'prefer-exponentiation-operator': 'off',
    'prefer-object-spread': 'off',
    'quote-props': 'off', // `prettier` already handles this
    quotes: 'off', // `prettier` already handles this
    'require-jsdoc': 'off',
    semi: 'off', // `prettier` already handles this
    'semi-spacing': 'off', // `prettier` already handles this
    'semi-style': 'off', // `prettier` already handles this
    'sort-keys': 'off',
    'sort-vars': 'off',
    'space-before-blocks': 'off', // `prettier` already handles this
    'space-before-function-paren': 'off', // `prettier` already handles this
    'space-in-parens': 'off', // `prettier` already handles this
    'space-infix-ops': 'off', // `prettier` already handles this
    'space-unary-ops': 'off', // `prettier` already handles this
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          exceptions: ['-', '+'],
          markers: [
            '=',
            '!',
            '/',
            '#region',
            '#endregion',
            'region',
            'endregion',
          ],
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!'],
          balanced: true,
        },
      },
    ],
    'switch-colon-spacing': 'off', // `prettier` already handles this
    'template-tag-spacing': 'off', // `prettier` already handles this
    'unicode-bom': 'off', // `prettier` already handles this
    'wrap-regex': 'off', // `prettier` already handles this

    // ECMAScript 6
    // http://eslint.org/docs/rules/#ecmascript-6
    'arrow-body-style': ['warn', 'as-needed'],
    'arrow-parens': 'off', // `prettier` already handles this
    'arrow-spacing': 'off', // `prettier` already handles this
    'constructor-super': 'error', // eslint:recommended
    'generator-star-spacing': 'off', // `prettier` already handles this
    'no-class-assign': 'off',
    'no-confusing-arrow': 'off', // `prettier` already handles this
    'no-const-assign': 'error', // eslint:recommended
    'no-dupe-class-members': 'warn', // eslint:recommended
    'no-duplicate-imports': 'off',
    'no-loss-of-precision': 'off', // eslint:recommended
    'no-new-symbol': 'error', // eslint:recommended
    'no-restricted-exports': 'off',
    'no-restricted-imports': 'off',
    'no-this-before-super': 'error', // eslint:recommended
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': [
      'error',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    'no-var': 'error',
    'object-shorthand': ['warn', 'always'],
    'prefer-arrow-callback': 'off', // `prettier` already handles this
    'prefer-const': ['error', {destructuring: 'all'}],
    'prefer-destructuring': 'off',
    'prefer-numeric-literals': 'off',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'off',
    'require-yield': 'error', // eslint:recommended
    'rest-spread-spacing': 'off', // `prettier` already handles this
    'sort-imports': 'off',
    'symbol-description': 'off',
    'template-curly-spacing': 'off', // `prettier` already handles this
    'yield-star-spacing': 'off', // `prettier` already handles this

    // https://github.com/mmkal/ts/tree/main/packages/eslint-plugin-codegen
    'codegen/codegen': 'warn',

    // https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/docs/rules
    'eslint-comments/disable-enable-pair': 'error',
    'eslint-comments/no-aggregating-enable': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-restricted-disable': 'off',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-disable': 'warn',
    'eslint-comments/no-unused-enable': 'warn',
    'eslint-comments/no-use': [
      'warn',
      {
        allow: [
          'eslint-disable',
          'eslint-disable-line',
          'eslint-disable-next-line',
          'eslint-enable',
        ],
      },
    ],
    'eslint-comments/require-description': 'off',

    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    'import/default': 'off',
    'import/dynamic-import-chunkname': 'off',
    'import/export': 'off',
    'import/exports-last': 'off',
    'import/extensions': 'off',
    'import/first': 'off',
    'import/group-exports': 'off',
    'import/imports-first': 'off',
    'import/max-dependencies': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/newline-after-import': 'off',
    'import/no-absolute-path': 'off',
    'import/no-amd': 'off',
    'import/no-anonymous-default-export': 'off',
    'import/no-commonjs': 'off',
    'import/no-cycle': ['error', {ignoreExternal: true}],
    'import/no-default-export': 'off',
    'import/no-deprecated': 'off',
    'import/no-duplicates': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__{mocks,tests,fixtures}__/**/*.{js,ts,tsx}',
          '**/*.{spec,test,fixture}.{js,ts,tsx}',
          '**/*.config.{js,ts}',
        ],
      },
    ],
    'import/no-import-module-exports': 'off',
    'import/no-internal-modules': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'warn',
    'import/no-named-default': 'off',
    'import/no-named-export': 'off',
    'import/no-namespace': 'off',
    'import/no-nodejs-modules': 'off',
    'import/no-relative-packages': 'off',
    'import/no-relative-parent-imports': 'off',
    'import/no-restricted-paths': 'off',
    'import/no-self-import': 'off',
    'import/no-unassigned-import': 'off',
    'import/no-unresolved': 'off',
    'import/no-unused-modules': 'off',
    'import/no-useless-path-segments': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'import/unambiguous': 'off',

    // https://github.com/xjamundx/eslint-plugin-promise/tree/master/docs/rules
    'promise/always-return': 'off',
    'promise/avoid-new': 'off',
    'promise/catch-or-return': 'error',
    'promise/no-callback-in-promise': 'warn',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-new-statics': 'error',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-return-in-finally': 'warn',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/prefer-await-to-callbacks': 'off',
    'promise/prefer-await-to-then': 'off',
    'promise/valid-params': 'warn',

    // https://github.com/sindresorhus/eslint-plugin-unicorn/tree/master/docs/rules
    'unicorn/better-regex': 'warn',
    'unicorn/catch-error-name': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/custom-error-definition': 'off',
    'unicorn/empty-brace-spaces': 'warn',
    'unicorn/error-message': 'warn',
    'unicorn/escape-case': 'warn',
    'unicorn/expiring-todo-comments': 'warn',
    'unicorn/explicit-length-check': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/import-index': 'warn',
    'unicorn/import-style': 'off',
    'unicorn/new-for-builtins': 'warn',
    'unicorn/no-abusive-eslint-disable': 'warn',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-method-this-argument': 'off', // Buggy
    'unicorn/no-array-push-push': 'warn',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-console-spaces': 'warn',
    'unicorn/no-document-cookie': 'warn',
    'unicorn/no-empty-file': 'error',
    'unicorn/no-for-loop': 'warn',
    'unicorn/no-hex-escape': 'warn',
    'unicorn/no-instanceof-array': 'warn',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-new-array': 'warn',
    'unicorn/no-new-buffer': 'warn',
    'unicorn/no-null': 'off',
    'unicorn/no-object-as-default-parameter': 'off',
    'unicorn/no-process-exit': 'off',
    'unicorn/no-static-only-class': 'off',
    'unicorn/no-thenable': 'error',
    'unicorn/no-this-assignment': 'warn',
    'unicorn/no-unreadable-array-destructuring': 'warn',
    'unicorn/no-unreadable-iife': 'warn',
    'unicorn/no-unsafe-regex': 'off',
    'unicorn/no-unused-properties': 'off',
    'unicorn/no-useless-fallback-in-spread': 'warn',
    'unicorn/no-useless-length-check': 'warn',
    'unicorn/no-useless-promise-resolve-reject': 'warn',
    'unicorn/no-useless-spread': 'off',
    'unicorn/no-useless-switch-case': 'warn',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-zero-fractions': 'warn',
    'unicorn/number-literal-case': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-add-event-listener': 'warn',
    'unicorn/prefer-array-find': 'off',
    'unicorn/prefer-array-flat-map': 'warn',
    'unicorn/prefer-array-flat': 'off',
    'unicorn/prefer-array-index-of': 'warn',
    'unicorn/prefer-array-some': 'warn',
    'unicorn/prefer-at': 'off',
    'unicorn/prefer-code-point': 'warn',
    'unicorn/prefer-date-now': 'warn',
    'unicorn/prefer-default-parameters': 'off',
    'unicorn/prefer-dom-node-append': 'warn',
    'unicorn/prefer-dom-node-dataset': 'warn',
    'unicorn/prefer-dom-node-remove': 'warn',
    'unicorn/prefer-dom-node-text-content': 'warn',
    'unicorn/prefer-export-from': 'warn',
    'unicorn/prefer-includes': 'warn',
    'unicorn/prefer-json-parse-buffer': 'off',
    'unicorn/prefer-keyboard-event-key': 'warn',
    'unicorn/prefer-math-trunc': 'warn',
    'unicorn/prefer-modern-dom-apis': 'warn',
    'unicorn/prefer-modern-math-apis': 'warn',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-native-coercion-functions': 'warn',
    'unicorn/prefer-negative-index': 'warn',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-number-properties': 'warn',
    'unicorn/prefer-object-from-entries': 'warn',
    'unicorn/prefer-object-has-own': 'off',
    'unicorn/prefer-optional-catch-binding': 'warn',
    'unicorn/prefer-prototype-methods': 'warn',
    'unicorn/prefer-query-selector': 'warn',
    'unicorn/prefer-reflect-apply': 'warn',
    'unicorn/prefer-regexp-test': 'warn',
    'unicorn/prefer-set-has': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prefer-string-replace-all': 'off',
    'unicorn/prefer-string-slice': 'warn',
    'unicorn/prefer-string-starts-ends-with': 'warn',
    'unicorn/prefer-string-trim-start-end': 'warn',
    'unicorn/prefer-switch': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prefer-type-error': 'warn',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/regex-shorthand': 'off',
    'unicorn/relative-url-style': 'warn',
    'unicorn/require-array-join-separator': 'warn',
    'unicorn/require-number-to-fixed-digits-argument': 'warn',
    'unicorn/require-post-message-target-origin': 'warn',
    'unicorn/string-content': 'off',
    'unicorn/template-indent': 'off',
    'unicorn/text-encoding-identifier-case': 'off',
    'unicorn/throw-new-error': 'warn',

    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/boolean-prop-naming': 'off',
    'react/button-has-type': 'off',
    'react/default-props-match-prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/display-name': 'off',
    'react/forbid-component-props': 'off',
    'react/forbid-dom-props': 'off',
    'react/forbid-elements': 'off',
    'react/forbid-foreign-prop-types': ['warn', {allowInPropTypes: true}],
    'react/forbid-prop-types': 'off',
    'react/function-component-definition': 'off',
    'react/hook-use-state': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-child-element-spacing': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-curly-brace-presence': ['warn'],
    'react/jsx-curly-newline': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-fragments': 'off',
    'react/jsx-handler-names': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-key': 'off',
    'react/jsx-max-depth': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-no-comment-textnodes': 'warn',
    'react/jsx-no-constructed-context-values': 'off', // TODO: Re-enable
    'react/jsx-no-duplicate-props': 'warn',
    'react/jsx-no-leaked-render': 'off',
    'react/jsx-no-literals': 'off',
    'react/jsx-no-script-url': 'off',
    'react/jsx-no-target-blank': 'warn',
    'react/jsx-no-undef': 'error',
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-pascal-case': ['warn', {allowAllCaps: true, ignore: []}],
    'react/jsx-props-no-multi-spaces': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-default-props': 'off',
    'react/jsx-sort-props': 'off',
    'react/jsx-space-before-closing': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'warn',
    'react/iframe-missing-sandbox': 'warn',
    'react/jsx-wrap-multilines': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/no-adjacent-inline-elements': 'off',
    'react/no-array-index-key': 'off',
    'react/no-arrow-function-lifecycle': 'warn',
    'react/no-children-prop': 'off',
    'react/no-danger-with-children': 'warn',
    'react/no-danger': 'off',
    'react/no-deprecated': 'off',
    'react/no-did-mount-set-state': 'off',
    'react/no-did-update-set-state': 'off',
    'react/no-direct-mutation-state': 'warn',
    'react/no-find-dom-node': 'off',
    'react/no-invalid-html-attribute': 'warn',
    'react/no-is-mounted': 'warn',
    'react/no-multi-comp': 'off',
    'react/no-namespace': 'error',
    'react/no-redundant-should-component-update': 'off',
    'react/no-render-return-value': 'off',
    'react/no-set-state': 'off',
    'react/no-string-refs': 'off',
    'react/no-this-in-sfc': 'off',
    'react/no-typos': 'error',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/no-unsafe': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/no-unused-class-component-methods': 'warn',
    'react/no-unused-prop-types': 'off',
    'react/no-unused-state': 'off',
    'react/no-will-update-set-state': 'off',
    'react/prefer-es6-class': 'off',
    'react/prefer-exact-props': 'off',
    'react/prefer-read-only-props': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/require-optimization': 'off',
    'react/require-render-return': 'error',
    'react/self-closing-comp': 'off',
    'react/sort-comp': 'off',
    'react/sort-prop-types': 'off',
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
    'react/style-prop-object': 'warn',
    'react/void-dom-elements-no-children': 'off',

    // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useUpdateEffect|useAsyncEffect|useAsyncCallback)',
      },
    ],

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-has-content': 'warn',
    'jsx-a11y/anchor-is-valid': ['warn', {aspects: ['noHref', 'invalidHref']}],
    'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-role': ['warn', {ignoreNonDOM: true}],
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/autocomplete-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/heading-has-content': 'warn',
    'jsx-a11y/html-has-lang': 'off',
    'jsx-a11y/iframe-has-title': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/lang': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-access-key': 'warn',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-distracting-elements': 'warn',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-onchange': 'off',
    'jsx-a11y/no-redundant-roles': 'warn',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
    'jsx-a11y/scope': 'warn',
    'jsx-a11y/tabindex-no-positive': 'off',
  },
}
