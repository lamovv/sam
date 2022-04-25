const {
  env
} = require('process');

const https = env.HTTPS == 1;

module.exports = {
  logLevel: 'TRACE', // 配置 TRACE 可查看代理明细
  silent: false,
  webRoot: 'app', // 默认 process.cwd()
  https,
  hosts: [
    'pre.my.domain.com',
    'daily.my.domain.com',
    'my.domain.com',
  ],
  // path: 'index.html',
  proxy: {
    port: 8881
  }
}
