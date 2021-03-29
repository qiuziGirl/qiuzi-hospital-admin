module.exports = {
  root: true,
  extends: ['stylelint-config-qiuzi/scss'],
  rules: {
    'selector-pseudo-class-no-unknown': [ true, {
      ignorePseudoClasses: ['export']
    }],
    'selector-max-class': 6,
    'selector-max-compound-selectors': 6,
    'selector-class-pattern': null,
    'scss/dollar-variable-pattern': null,
    'color-named': null,
    'selector-max-id': 3,
    'declaration-no-important': null,
    'selector-no-qualifying-type': null,
    "at-rule-no-unknown": [ true, {
      ignoreAtRules: ['extend', 'at-root', 'debug', 'warn', 'error', 'if', 'else', 'for', 'each', 'while', 'mixin', 'include', 'content', 'return', 'function']
    }],
    'property-no-unknown': [true, {
      ignoreProperties: ['/^custom/']
    }]
  }
}
