module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-async-promise-executor': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'no-unused-vars': ['error',
      { vars: 'all', args: 'after-used' }
    ]
  },
  globals: {
    $api: true,
    $dayjs: true
  }
}
