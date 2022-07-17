const chalk = require('chalk');
const ora = require('ora');
const {
  IP
} = require('../env');
const getrc = require('./getrc');
const log = require('../logger');
const logger = log.getLogger('guide');

let spinner = ora();

function starting(){
  spinner = ora({
    text: `${chalk.magenta('本地开发环境启动中...\n')}`,
    color: 'magenta',
    spinner: 'arrow3',
  }).start();
}
function failed(){
  spinner.color = 'red';
  spinner.fail(chalk.red('本地开发环境启动异常\n'));
}
function stop(){
  spinner.color = 'gray';
  spinner.stop();
}
function guide({ webPort }){
  spinner.color = 'green';
  spinner.succeed(chalk.green('本地开发环境启动成功\n'));

  const {
    https,
    hosts,
    proxy: {
      port = 8880
    } = {}
  } = getrc();
  const protocol = `http${https ? 's' : ''}`;

  const tips = ['=========== 本地服务信息 ===========\n', '可访问域名：']
    .concat(
      hosts.map((host, idx) => {
        return `${idx ? '\t\t' : '\t'}-> ${chalk.underline(`${protocol}://${host}`)}\n`;
      })
    )
    .concat([
      `\n静态资源服务器\t-> ${chalk.underline(`${protocol}://localhost:${webPort}`)}\n`,
      `代理服务器\t-> ${chalk.underline(`http://${IP}:${port}`)}\n`,
      `代理监控&根证书\t-> ${chalk.underline(`http://${IP}:8002`)}\n`,
      '=============== END ===============\n',
    ])
    .join('');

  logger.info(chalk.green(tips));
}

module.exports = {
  starting,
  failed,
  stop,
  guide,
};
