module.exports = {
  root: true,
  extends: ['stylelint-config-qiuzi/scss'],
  rules: {
    'selector-max-class': 6,
    'selector-max-compound-selectors': 6,
    'scss/dollar-variable-pattern': null,
    'selector-max-id': 3,
    'selector-no-qualifying-type': null
  }
}
