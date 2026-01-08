// pm2.config.js
module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npm",
      args: "start",
    },
    {
      name: "email-worker",
      script: "workers/emailWorker.ts",
      interpreter: "tsx",
    }
  ]
};