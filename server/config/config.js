var env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  var config = require("./config.json")[env];
  Object.keys(config).forEach(k => {
    process.env[k] = config[k];
  });
}

