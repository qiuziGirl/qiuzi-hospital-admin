module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'no-unused-vars': ['error',
      { vars: 'all', args: 'after-used' }
    ],
    'vue/multi-word-component-names': ['off', {
      ignores: []
    }]
  },
  globals: {
    $api: true,
    $dayjs: true
  }
}
