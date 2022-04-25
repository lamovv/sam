import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {
  getCertPath
} from '@ufly/sam';
import {
  env
} from 'process';
import buildDone from './vite-plugin-build-done';

const https = env.HTTPS == '1';
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
    buildDone(),
  ]
})
