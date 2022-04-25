const {
  env
} = require('process');

const https = env.HTTPS == 1;

module.exports = {
  logLevel: 'DEBUG',
  https,
  hosts: [
    // 配置域名
    'your.dev.domain.com',
  ],
  // 入口页面路径
  // path: 'app/index.html',
  // 代理服务配置
  // proxy: {
  //   port: 8880
  // }
}
