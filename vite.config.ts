/// <reference types="vitest" />

import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Unocss from 'unocss/vite';
import Jsx from '@vitejs/plugin-vue-jsx';
import dayjs from 'dayjs';
import Inspect from 'vite-plugin-inspect';

const envPrefix = 'VITE_';
const envPath = path.resolve(__dirname, './config');

export default defineConfig(({ mode }) => {
  const privateEnv = loadEnv(mode, envPath, envPrefix);
  return {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },

    // evv path
    envDir: envPath,

    // serve proxy
    server: {
      port: 9527,
      proxy: {
        [privateEnv.VITE_BASE_API]: {
          target: 'http://127.0.0.1:7001/',
          changeOrigin: true,
        },
      },
    },

    // preview proxy
    preview: {
      port: 9529,
      proxy: {
        [privateEnv.VITE_BASE_API]: {
          target: 'http://127.0.0.1:7001/',
          changeOrigin: true,
        },
      },
    },

    define: {
      'import.meta.env.BUILD_TIME': JSON.stringify(dayjs().format('YY-MM-DD HH:mm:ss')),
      'import.meta.env.NODE_ENV': privateEnv.VITE_DEVELOP,
    },

    plugins: [
      Vue(),
      Jsx(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        include: [
          /\.[jt]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
        dts: true,
        dirs: ['./src/composables'],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      Inspect(),
    ],
  };
});
