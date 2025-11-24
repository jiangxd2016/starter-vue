import { createI18n } from 'vue-i18n';
import type { App } from 'vue';
import pinia from '/@/store';
import { useSettingsStore } from '/@/store/modules/settings';

const modules = import.meta.glob(['./**/*.json'], { eager: true, import: 'default' });

const ALL_LOCALES = { zh: {}, en: {} };

/**
 * --i18n
 * ----en.json
 * ----zh.json
 * ----common
 * --------zh.json
 * --------en.json
 * ----menu
 * --------zh.json
 * --------en.json
 * 只处理一层嵌套的namespace
 */
function getNameSpace(path) {
  // 核心正则表达式
  const match = path.match(/^\.\/(?:([^/]+)\/)?([a-z]+)\.json$/);
  return [
    match[1] || '', // 根文件夹（无则留空）
    match[2], // 语言代码（en/zh）
  ];
}

for (const path in modules) {
  const [key, lang] = getNameSpace(path);
  const value = modules[path];
  if (key) {
    ALL_LOCALES[lang][key] = value;
  } else {
    Object.assign(ALL_LOCALES[lang], value);
  }
}

const messages: Record<LanguageType, any> = ALL_LOCALES;

const getLanguage = () => {
  const { getLanguage } = useSettingsStore(pinia);
  return getLanguage;
};

export const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'zh',
  messages,
  // 确保可以使用点表示法访问嵌套的键
  flatJson: false,
  // 允许使用组合式 API
  allowComposition: true,
  // 在开发环境下显示翻译缺失警告
  missingWarn: process.env.NODE_ENV === 'development',
  fallbackWarn: process.env.NODE_ENV === 'development',
  // messageResolver: (obj, path) => {
  //   debugger;
  //   return get(obj, path);
  // },
});

export const setupI18n = (app: App<Element>) => {
  app.use(i18n);
  return i18n;
};

export const t = (message: string | undefined, namedValue?: Record<string, string>): string => {
  if (!message) return '';
  // @ts-ignore
  return i18n.global.t(message, namedValue) as string;
};

export const translate = (message: string | undefined, module: string = 'vabI18n') => {
  if (!message) return '';
  return (
    [getLanguage(), module, message].reduce((o, k) => (o || {})[k], messages as any) || message
  );
};

export { default as enLocale } from 'element-plus/dist/locale/en';

export { default as zhLocale } from 'element-plus/dist/locale/zh-cn';
