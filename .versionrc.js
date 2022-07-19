module.exports = {
  silent: true,
  tagPrefix: '',
  skip: {
    changelog: true,
  },
  scripts: {
    postbump: 'node build.js',
    posttag: 'git push --follow-tags origin master && cd dist && npm publish',
  },
};
