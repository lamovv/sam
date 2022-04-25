const AnyProxy = require('anyproxy');
const { getReqPathRule } = require('./rules/request.path');
const log = require('./logger');

const logger = log.getLogger('proxy');

function start(options) {
  if (start.__proxyServer) {
    return start.__proxyServer;
  }

  const { silent, proxy } = options;

  const _options = {
    port: 8880,
    rule: getReqPathRule(options),
    dangerouslyIgnoreUnauthorized: true,
    wsIntercept: true, // 是否开启websocket代理
    silent, // 是否屏蔽console输出
    // web版界面配置，端口默认 8002
    webInterface: {
      enable: true,
    },
    ...proxy,
  };

  const proxyServer = new AnyProxy.ProxyServer(_options);

  proxyServer.on('ready', () => {
    logger.trace('代理服务Web UI：http://localhost:8002');
  });
  proxyServer.on('error', e => {
    logger.error('proxy server error: ', e);
  });

  proxyServer.start();

  start.__proxyServer = proxyServer;
  return proxyServer;
}

module.exports = {
  start,
};
