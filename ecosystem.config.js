module.exports = {
    apps: [
      {
        name: "app",
        script: "./server.js",
        interpreter: "./node_modules/.bin/babel-node",
        watch: true,
      },
      {
        name: "database",
        script: "./src/modal/CreateDatabase.js",
        interpreter: "./node_modules/.bin/babel-node",
        watch: true,
      },
    ],
  };
  