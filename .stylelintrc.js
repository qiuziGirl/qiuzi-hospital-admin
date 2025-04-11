module.exports = {
  root: true,
  extends: ['stylelint-config-qiuzi/scss', "stylelint-config-html/vue"],
  rules: {
    'import-notation': 'string',
    'selector-max-class': 6,
    'selector-max-compound-selectors': 6,
    'scss/dollar-variable-pattern': null,
    'selector-max-id': 3,
    'selector-no-qualifying-type': null,
    'selector-class-pattern': [
      "^([a-z][a-z0-9]*)((__[a-z0-9]+)|(--[a-z0-9]+))*((-|__|--)[a-z0-9]+)*$",
      {
        message: (selector) => `类名 "${selector}" 需符合 kebab-case 或 BEM 规范（block__element--modifier）`,
        resolveNestedSelectors: true // 允许嵌套选择器验证
      }
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        "ignorePseudoElements": ["v-deep"]
      }
    ],
    "value-keyword-case": ["lower", {
      "ignoreKeywords": ["currentColor"]
    }]
  }
}
