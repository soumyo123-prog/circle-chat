import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const fs = require('fs');
const env = loadEnv('development', process.cwd(), '');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(env.SSL_KEY_FILE),
      cert: fs.readFileSync(env.SSL_CRT_FILE)
    }
  }
});
