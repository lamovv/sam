module.exports = {
  silent: true,
  tagPrefix: '',
  skip: {
    changelog: true
  },
  scripts: {
    postbump: 'node build.js',
  }
}

