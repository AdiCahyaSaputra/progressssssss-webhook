module.exports = {
  apps: [{
    name: "github-discord-bot",
    script: "index.js",
    watch: true,
    // Ignore watch on log files
    ignore_watch: ["logs/*", "node_modules"],
    env: {
      NODE_ENV: "production",
    },
    // Restart if app uses more than 100MB
    max_memory_restart: "100M",
    // Error log file
    error_file: "logs/err.log",
    // Out log file
    out_file: "logs/out.log",
    // Time format for logs
    time: true,
  }]
} 