import type { Config } from 'stylelint'

const ignoreAtRules = [
  'extends',
  'ignores',
  'include',
  'mixin',
  'if',
  'else',
  'media',
  'for',
  'at-root',
  'tailwind',
  'apply',
  'variants',
  'responsive',
  'screen',
  'function',
  'each',
  'use',
  'forward',
  'return',
  'reference',
  'plugin',
  'source',
  'theme',
  'utility',
  'custom-variant',
]

export default {
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.json5', '**/*.md'],
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order', '@stylistic/stylelint-plugin', 'stylelint-scss'],
  overrides: [
    {
      files: ['*.(html|vue)', '**/*.(html|vue)'],
      customSyntax: 'postcss-html',
      rules: {
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global', 'deep'],
          },
        ],
        'selector-pseudo-element-no-unknown': [
          true,
          {
            ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
          },
        ],
      },
    },
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss',
      extends: ['stylelint-config-recommended-scss', 'stylelint-config-recommended-vue/scss'],
    },
  ],
  rules: {
    'at-rule-no-deprecated': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules,
      },
    ],
    'custom-property-pattern': [null, { severity: 'warning' }],
    'font-family-no-missing-generic-family-keyword': null,
    'function-no-unknown': null,
    'import-notation': null,
    'media-feature-range-notation': null,
    'named-grid-areas-no-invalid': null,
    'nesting-selector-no-missing-scoping-root': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          name: 'supports',
          type: 'at-rule',
        },
        {
          name: 'media',
          type: 'at-rule',
        },
        {
          name: 'include',
          type: 'at-rule',
        },
        'rules',
      ],
      { severity: 'error' },
    ],
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules,
      },
    ],
    'scss/operator-no-newline-after': null,
    'selector-class-pattern':
      '^-?(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:[.+])?$',
    'selector-not-notation': null,
  },
} satisfies Config
