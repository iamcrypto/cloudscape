module.exports = {
  apps: [
    {
      name: "app",
      script: "./server.js",
      interpreter: "./node_modules/.bin/babel-node",
      watch: true,
      env_development: {
        NODE_ENV: "development",
        // Add other environment variables for development here
      },
      env_production: {
        NODE_ENV: "production",
        // Add other environment variables for production here
      },
    },
    {
      name: "database",
      script: "./src/modal/CreateDatabase.js",
      interpreter: "./node_modules/.bin/babel-node",
      watch: true,
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
