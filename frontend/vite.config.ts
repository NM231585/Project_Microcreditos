import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'figma:asset/9ff15ae8c40c117941b9a2e4108fd0cf3e6a7edf.png': path.resolve(__dirname, './src/assets/9ff15ae8c40c117941b9a2e4108fd0cf3e6a7edf.png'),
      'figma:asset/2cbbe27ae20e8f5f2307fcbc1f4fafe08a8774e9.png': path.resolve(__dirname, './src/assets/2cbbe27ae20e8f5f2307fcbc1f4fafe08a8774e9.png'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});