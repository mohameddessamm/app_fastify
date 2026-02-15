import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // حذفنا إعدادات الـ babel والـ compiler مؤقتاً
  ],
})