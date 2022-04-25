import { defineConfig } from 'dumi';

import { getCertPath } from '@ufly/sam';
const { env } = require('process');

const https = env.HTTPS == 1;
const cert = getCertPath();

export default defineConfig({
  title: 'dumi',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  devServer: {
    https: https && cert,
  },
});
