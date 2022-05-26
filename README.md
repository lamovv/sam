# sam

     .--.    ,--.    _ .--..--.
    ( (`\]  `'_\ :  [ `.-. .-. |
     `'.'.  // | |,  | | | | | |
    [\__) ) \'-;__/ [___||__||__]

> [@ufly/sam](https://www.npmjs.com/package/@ufly/sam)

---
在提供模拟 多套部署环境（日常/预发/生产）服务，解决 登录态、https 等本地开发调试环境问题。
定义为 `simulator`，取 `same` 之义，简名为 `sam`。

### Support
无侵入的适配多开发框架

- umi/dumi
- vite
- webpack
- vue-cli-service
- default
  - 基于`koa`、`koa-static`的`peerDependencies` 启动 Web Server 服务，便于预览项目编译构建后的效果

### Usage
1. 安装依赖：
  - 应用内依赖：`ayarn add @ufly/sam`
  - 或全局安装：`ayarn global add @ufly/sam`
2. 初始化 `sam` 配置文件 `.samrc.js`：`$ npx --no-install sam init`

  ```javascript
  // .samrc.js
  const {
    env
  } = require('process');

  const https = env.HTTPS == 1;

  module.exports = {
    silent: false,  // 查看运行明细
    logLevel: 'DEBUG', // 配置 TRACE 可查看更详细log
    https,  // 是否启用https
    hosts: [  // 各环境域名
      'pre.my.domain.com',
      'daily.my.domain.com',
      'my.domain.com',
    ],
    path: 'app/index.html', // 应用入口
  }
  ```
3. `umi|dumi / vite / webpack / vue(vue-cli-service) / Rax ` 等融合环境下配置。理论上，通过`.samrc.js`的`cliPath`配置，可与任何Cli本地服务融合。
  - `umi|dumi`
    1. 配置 `.umirc.js` 或 `config/config.dev.js`：

      ```javascript
      import { defineConfig } from 'umi';
      import { getCertPath } from '@ufly/sam';
      import { env } from 'process';

      const https = env.HTTPS == 1;
      const cert = getCertPath();

      export default defineConfig({
        //...,
        devServer: {
          https: https && cert
        }
      });
      ```
    2. 配置`dev`服务启动脚本：`package.json`

      ```json
      {
        "scripts": {
          "dev": "cross-env REACT_APP_ENV=dev HTTPS=1 sam umi",
        }
      }
      ```
  - vite
    1. `vite` 配置 `vite.config.ts`：

      ```javascript
      // 以使用react为例
      import { defineConfig } from 'vite';
      import react from '@vitejs/plugin-react';
      import { getCertPath } from '@ufly/sam';
      import { env } from 'process';

      const https = env.HTTPS == 1;
      const cert = getCertPath();

      // https://vitejs.dev/config/
      export default defineConfig({
        server: {
          https: https && cert,
          hmr: {
            protocol: `ws${https?'s':''}`,
            host: 'localhost',
          }
        },
        plugins: [
          react(),
        ]
      })
      ```
    2. 配置`dev`服务启动脚本：`package.json`

      ```json
      {
        "scripts": {
          "dev": "cross-env HTTPS=1 sam vite",
        }
      }
      ```
  - webpack
    1. `webpack` 配置 `webpack.config.js`(基于`webpack@5`举例，可结合`webpack`不同版本稍加调整)：

      ```javascript
      const isProduction = process.env.NODE_ENV == 'production';

      // 仅列出 sam 相关，其他配置略
      const { getCertPath } = require('@ufly/sam');
      const { env } = require('process');
      const https = env.HTTPS == 1;
      const cert = getCertPath();

      const config = {
        // ...,
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
          }
        },
        // ...
      };

      module.exports = () => {
        config.mode = isProduction ? 'production': 'development';
        return config;
      };
      ```
    2. 配置`dev`服务启动脚本：`package.json`

      ```json
      {
        "scripts": {
          "dev": "cross-env HTTPS=1 sam webpack serve --stats-error-details",
        }
      }
      ```
  - vue(vue-cli-service)
    1. `vue` 配置 `vue.config.ts`(基于`webpack@5`举例，可结合`webpack`不同版本稍加调整)：

      ```javascript
      const { defineConfig } = require('@vue/cli-service');
      const { getCertPath } = require('@ufly/sam');
      const { env } = require('process');

      const https = env.HTTPS == '1';
      const cert = getCertPath();

      module.exports = defineConfig({
        // 融合Sam 配置
        devServer: {
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
        }
      })
      ```
    2. 配置`dev`服务启动脚本：`package.json`

      ```json
      {
        "scripts": {
          "dev": "cross-env HTTPS=1 sam vue serve",
          // 或者，二者都可
          "dev": "cross-env HTTPS=1 sam vue-cli-service serve",
        }
      }
      ```

  - rax(通过插件定制工程)
    1. 在项目根目录下新建 `build.plugin.js` 文件

      ```js
      const {
        getCertPath,
      } = require('@ufly/sam');
      const {
        env,
      } = require('process');

      const https = env.HTTPS == 1;
      const cert = getCertPath();

      module.exports = ({ context, onGetWebpackConfig }) => {
        onGetWebpackConfig((config) => {
          config.merge({
            // 融合Sam 配置
            devServer: {
              open: false,
              server: {
                type: `http${https ? 's' : ''}`,
                options: {
                  ...cert,
                },
              },
              webSocketServer: 'ws',
              client: {
                webSocketURL: {
                  protocol: `ws${https ? 's' : ''}`,
                  hostname: 'localhost',
                },
              },
            },
          });
        });
      };
      ```
    2. 在 `build.json` 里引入自定义插件：

      ```json
      {
        "webpack5": true,
        "targets": [
          "web"
        ],
        "plugins": [
          "./build.plugin.js",  // 配置自定义插件
        ]
      }
      ```
    3. 配置`dev`服务启动脚本：`package.json`

      ```json
      {
        "scripts": {
          "dev": "cross-env HTTPS=1 sam rax-app start"
        }
      }
      ```

### preview
预览项目编译后的效果

1. 应用需要安装依赖：`$ yarn add koa koa-static -D`
2. 编辑 `.samrc.js` 配置，指定 `webRoot` 编译构建后的目录，如：`webRoot: './dist'`
3. 配置`preview`服务启动脚本：`package.json`

  ```json
  {
    "scripts": {
      "preview": "cross-env HTTPS=1 sam dev"
    }
  }
  ```
