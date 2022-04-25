module.exports = {
  './lib/*': [
    'prettier --write',
    'eslint --fix',
    // 'conventional-changelog -p angular -i CHANGELOG.md -s',
    // 'git add CHANGELOG.md'
  ]
};