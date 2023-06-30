const _ = require("lodash");
const fs = require("fs");
const path = require("path");

async function main() {
  const configPath = path.join(__dirname, "../electron/config.json");
  const config = {
    PUSHY_APP_ID: process.env.PUSHY_APP_ID || ""
  };
  await fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

main();
