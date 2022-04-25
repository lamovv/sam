const { defineConfig } = require('@vue/cli-service');
const {
  getCertPath
} = require('@ufly/sam');
const {
  env
} = require('process');

const https = env.HTTPS == '1';
const cert = getCertPath();

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 融合Sam 配置
    allowedHosts: 'all',
    server: {
      type: `http${https ? 's':''}`,
      options: {
        ...cert
      }
    },
    webSocketServer: 'ws',
    client: {
      webSocketURL: {
        protocol: `ws${https?'s':''}`,
        hostname: 'localhost',
      }
    },

    // webSocketServer: 'sockjs',
    // client: {
    //   // webSocketTransport: 'ws',
    //   webSocketURL: 'auto://0.0.0.0/ws',
    // }
  }
})
