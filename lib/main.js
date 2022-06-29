const { open } = require('./open');
const { getDomainCertPath, getDomainCert, clearCerts } = require('./getCert');
const { checkLocalHost, getrc } = require('./utils');
const { start } = require('./proxy');
const { updateRule } = require('./rules/request.path');
const log = require('./logger');
const logger = log.getLogger('index');

function main(options = {}) {
  const _options = {
    silent: true,
    hosts: ['demo.com'],
    ...options,
    ...getrc(),
  };

  if (!main.__proxyServer) {
    logger.trace('入口合并的配置参数：', _options);
    checkLocalHost();

    const { autoOpen = true, https } = _options;
    const protocol = https ? 'https' : 'http';

    main.__proxyServer = start({
      ..._options,
      protocol,
    });

    if (autoOpen) {
      open(_options);
    }
  } else {
    updateRule(options);
  }
}

function getHosts() {
  const rc = getrc();
  return rc.hosts || ['demo.com'];
}

function getCertPath() {
  return getDomainCertPath();
}

process.on('unhandledRejection', reason => {
  console.error(reason);
});
function out(e) {
  main.__proxyServer?.close();
  process.exit();
}
process.on('SIGINT', out);
process.on('SIGILL', out);

module.exports = {
  main,
  getHosts,
  getCertPath,
  getDomainCert,
  clearCerts,
};
