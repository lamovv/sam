const {
  env
} = require('process');

const https = env.HTTPS == 1;

module.exports = {
  logLevel: 'DEBUG', // 配置 TRACE 可查看代理明细
  https,
  hosts: [
    'pre.my.domain.com',
    'daily.my.domain.com',
    'my.domain.com',
  ],
  // path: 'app/index.html',
  proxy: {
    port: 8886
  }
}
