import { mergeConfig } from 'vite';
import baseConig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'production',
    server: {
      open: true,
      fs: {
        strict: true,
      },
    },
  },
  
  baseConig
);
