/**
 * @desc 自启Server[koa]
 */
const http = require('http');
const http2 = require('http2');
const log = require('./logger');

const logger = log.getLogger('default');

module.exports = function entry({ https, cert, port, webRoot }) {
  const Koa = require('koa');
  const app = new Koa();
  // TODO ~ 支持访问目录
  app.use(require('koa-static')(webRoot));

  if (https) {
    http2
      .createSecureServer(
        {
          ...cert,
          allowHTTP1: true,
        },
        app.callback()
      )
      .listen(port);
  } else {
    http.createServer(app.callback()).listen(port);
  }
  logger.trace(`静态服务路径：${webRoot}`);
};
