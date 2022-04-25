module.exports = {
  silent: true,
  tagPrefix: '',
  skip: {
    changelog: true
  },
  scripts: {
    postbump: 'git add . -A',
    precommit: 'node build.js',
    postcommit: 'node git.js',
  }
}

