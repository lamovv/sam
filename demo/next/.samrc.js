const {
  env
} = require('process');

const https = env.HTTPS == 1;

module.exports = {
  silent: false,
  // logLevel: 'DEBUG',
  logLevel: 'TRACE',
  https,
  hosts: [
    'pre.my.domain.com',
    'daily.my.domain.com',
    'my.domain.com',
  ],
  // path: 'app/index.html',
  proxy: {
    port: 8882
  }
}
