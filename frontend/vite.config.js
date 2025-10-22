import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ping-endpoint',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/ping' || req.url === '/api/ping') {
            res.setHeader('Content-Type', 'text/plain');
            res.end('pong');
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'your-say.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})
