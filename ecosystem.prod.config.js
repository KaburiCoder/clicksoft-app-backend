module.exports = {
  apps: [
    {
      name: 'click.app-backend',
      exec_mode: 'cluster',
      instances: '1',
      script: 'dist/main.js',
      args: 'start',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 4010,
      },
    },
  ],
};
