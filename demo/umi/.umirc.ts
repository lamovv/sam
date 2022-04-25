import { defineConfig } from 'umi';
import {
  getCertPath
} from '@ufly/sam';
const {
  env
} = require('process');

const https = env.HTTPS == 1;
const cert = getCertPath();

export default defineConfig({
  devtool: 'source-map',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{
      path: '/',
      component: '@/pages/index'
    },
  ],
  fastRefresh: {},
  devServer: {
    https: https && cert
  }
});
