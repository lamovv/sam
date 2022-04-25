const { env } = require('process');

const https = env.HTTPS == 1;

module.exports = {
  root: true,
  silent: false,
  logLevel: 'DEBUG', // 配置 TRACE 可查看代理明细
  https,
  hosts: ['pre.my.domain.com', 'daily.my.domain.com', 'my.domain.com'],
  proxy: {
    port: 8880,
  },
};
