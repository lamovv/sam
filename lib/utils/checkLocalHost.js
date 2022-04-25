const {
  get,
  HOSTS
} = require('hostile');
const shell = require('shelljs');
const log = require('../logger');

const logger = log.getLogger('utils.checkLocalHost');

// 校对确保本地已绑定localhost
function checkLocalHost() {
  const ip = '127.0.0.1';
  const host = 'localhost';
  let hasLocalhost = false;

  try {
    const localList = get() || [];
    localList.some(local => {
      return (hasLocalhost = local[0] == ip && local[1] == host);
    });
  } catch (err) {
    return hasLocalhost;
  }

  if (!hasLocalhost) {
    try {
      logger.info(`> 将自动添加 "${ip}  ${host}" 到本地 host 文件中，请输入本机密码：`);
      shell.exec(
        `sudo -- sh -c -e "echo '\n${ip} ${host}' >> ${HOSTS}";`
      );
      logger.info('> 添加成功');
    } catch (err) {
      logger.error('> 自动添加失败，请手动添加后重试');
      throw err;
    }
  }
}

module.exports = checkLocalHost;