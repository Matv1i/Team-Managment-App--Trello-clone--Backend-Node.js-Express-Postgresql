module.exports = {
  apps: [
    {
      name: "project-managmnet",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
}
