/** @type {import('next').NextConfig} */
const {
  getCertPath
} = require('@ufly/sam');
const {
  env
} = require('process');

const https = env.HTTPS == 1;
const cert = getCertPath();

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, {webpack}) => {
    // 融合Sam 配置
    try{
      webpack({
        devServer: {
          allowedHosts: 'all',
          server: {
            type: `http${https ? 's':''}`,
            options: {
              ...cert
            }
          },
          webSocketServer: 'sockjs',
          client: {
            webSocketURL: 'auto://0.0.0.0/ws',
          }
        },
      });
    }catch(e){
      console.log('error', e);
    }

    return config;
  },
}

module.exports = nextConfig
