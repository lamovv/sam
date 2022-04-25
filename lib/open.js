const shell = require('shelljs');
const { join } = require('path');
const { IP } = require('./env');
const { USER_DATA_PATH } = require('./constant');
const log = require('./logger');

const logger = log.getLogger('open');

function open(options = {}) {
  const { silent, https, hosts = [], path = '', proxy = {} } = options;

  const { UA, port } = {
    port: '8880',
    ...proxy,
  };

  const protocol = https ? 'https' : 'http';
  const host = hosts[0] || IP;

  logger.trace(`浏览器使用 ${port} 做为代理端口`);
  const {
    browser = {
      app: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // mac chrome
      args: [
        `--proxy-server="127.0.0.1:${port}"`, // 使用给定的代理服务器
        UA ? `--user-agent=${UA}` : '', // 使用给定的 User-Agent 字符串
        `--user-data-dir="${join(USER_DATA_PATH, `${port}`)}"`, // 指定user配置等信息存储位置
        '--auto-open-devtools-for-tabs',
        '--allow-running-insecure-content',
        // '--disable-desktop-notifications',
        // '--remote-debugging-port=9222', // debug
      ],
    },
  } = options;
  const { app, args } = browser;

  const cmdList = [app.replace(/(\s+)/g, '\\$1')].concat(args).concat([join(`${protocol}://${host}`, path)]);

  const cmd = cmdList.join(' ');
  shell.exec(
    cmd,
    {
      silent,
      async: !0,
    },
    (code, output) => {
      //
    }
  );
}

module.exports = {
  open,
};
