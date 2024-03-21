module.exports = {
  apps: [
    {
      name: 'click.app-backend-1',
      exec_mode: 'cluster',
      instances: 1,
      script: 'dist/main.js',
      args: 'start',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 4010,
      },
    },
    {
      name: 'click.app-backend-2',
      exec_mode: 'cluster',
      instances: 1,
      script: 'dist/main.js',
      args: 'start',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 4011,
      },
    },
  ],
};
