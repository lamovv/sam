const yargs = require('yargs');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const entry = require('./index');

const {
  rc: { cliPath: cli_path },
} = entry;
const types = ['umi', 'dumi', 'vue', 'vite', 'webpack', 'next'];
const gArgv = process.argv.splice(3);

yargs
  .scriptName('sam')
  .usage('$0 <cmd> [args]')
  .command(
    'init',
    '初始化配置文件',
    yargs => {
      return yargs.option('init', {
        alias: 'i',
      });
    },
    args => {
      const rcPath = path.join(process.cwd(), '.samrc.js');
      if (!fs.existsSync(rcPath)) {
        fs.copyFileSync(require.resolve('./tpl/rc.tpl'), rcPath);
      }
    }
  )
  .command(
    '*',
    '使用 cmd 启动 dev 服务',
    yargs => {
      const _ = yargs.argv?._;
      if (!_.length) {
        const fig = figlet.textSync('  sam', {
          font: 'Varsity',
          width: 60,
          whitespaceBreak: true,
          horizontalLayout: 'full',
        });
        console.log(chalk.hex('#DEADED').bold(fig));
      }
    },
    args => {
      const { _ } = args;

      if (_.length) {
        const cli = _?.[0];
        const cmd = _?.[1];
        const argv = (cmd ? [] : ['dev']).concat(gArgv);

        runCli(cli, argv);
      } else {
        yargs.showHelp();
      }
    }
  )
  .command(
    'dev',
    '启动 dev 服务',
    yargs => {
      yargs.option('type', {
        type: 'string',
        alias: 't',
        demand: false,
        example: '$0 dev -t umi',
        describe: '服务基于的环境',
      });
    },
    argv => {
      runCli('default', ['dev']);
    }
  )
  .command('clear', '清除系统信任证书', () => {
    require('./getCert').clearCerts();
  })
  .help('info')
  .alias('help', 'h')
  .alias('version', 'v')
  .epilog('本地dev环境模拟器，无侵入融合 umi(dumi)/vite/webpack/nextjs/esbuild 等开发环境').argv;

function runCli(cli, argv = []) {
  let cliPath;
  switch (cli) {
  case 'default':
    cliPath = null;
    break;
  case 'vue':
  case 'vue-cli-service':
    cliPath = '@vue/cli-service/bin/vue-cli-service';
    break;
  case 'next':
    cliPath = `${cli}/dist/bin/${cli}`;
    break;
  case 'rax-app':
    cliPath = 'rax-app/bin/rax-cli';
    break;
  default:
    if (cli_path) {
      cliPath = cli_path;
    } else {
      cliPath = `${cli}/bin/${cli}`;
    }
  }

  entry(cli, cliPath, argv);
}
