import { estjs } from '@estjs/eslint-config';

export default estjs({
  unicorn: {
    'prefer-modern-dom-apis': 'off',
    'prefer-dom-node-remove': 'off',
  },
  typescript: {
    '@typescript-eslint/no-this-alias': 'off',
  },
  javascript: {
    'no-prototype-builtins': 'off',
  },
});
