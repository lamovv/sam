const shell = require('shelljs');
const esbuild = require('esbuild');
const glob = require('glob');
const fs = require('fs');
const pkg = require('./package.json');

const dist = 'dist';
// clean
shell.exec(`rm -rf ${dist}`);

// esbuild
// const entryPoints = glob.sync('./lib/**/*.js');
esbuild.buildSync({
  entryPoints: ['./lib/index.js'],
  bundle: true,
  format: 'cjs',
  outdir: 'dist/lib',
  platform: 'node',
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  treeShaking: true,
  external: Object.keys(pkg.dependencies).concat(Object.keys(pkg.peerDependencies || {})),
});
esbuild.buildSync({
  entryPoints: ['./lib/options.js'],
  format: 'cjs',
  outdir: 'dist/lib',
  platform: 'node',
  minify: true,
  minifySyntax: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  treeShaking: true,
});
// gen pkg.json
const {
  name,
  version,
  description,
  repository,
  bin,
  main,
  files,
  license,
  dependencies,
  engines,
  publishConfig,
  peerDependencies,
} = pkg;
fs.writeFileSync(
  'dist/package.json',
  JSON.stringify(
    {
      name,
      version,
      description,
      repository,
      bin,
      main,
      files,
      license,
      dependencies,
      engines,
      publishConfig,
      peerDependencies,
    },
    null,
    2,
  ),
);
shell.exec('cp -rf ./README.md bin dist/');
shell.exec('cp -rf ./lib/tpl dist/lib');
