module.exports = {
  root: true,
  // parser: 'typescript',
  semi: true, // 行尾分号
  arrowParens: 'avoid', // 只有一个参数的箭头函数不带圆括号(默认avoid不带)
  bracketSpacing: true, // 花括号前后空格
  jsxBracketSameLine: true, //使多行JSX元素最后一行末尾的 > 单独一行
  printWidth: 160, // 自动换行
  // proseWrap: 'never', // 代码不自动折行
  quoteProps: 'as-needed', // 仅在需要的时候使用
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5', // 数组、对象末尾元素不需要逗号
  endOfLine: 'lf',
};