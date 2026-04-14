module.exports = {
  apps: [
    {
      name: 'valentina-backend',
      // cwd nel backend così tutti i path relativi del .env
      // (./data/blog.db, ./uploads, ./logs) risolvono dentro backend/
      cwd: '/var/www/valentina/backend',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
