const { createHash } = require("crypto");
const { createReadStream, readFileSync, statSync, writeFileSync } = require("fs");
const path = require("path");
const yaml = require("yaml");


function getHashSum(file, encoding = "base64") {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha512")
    hash.on("error", reject).setEncoding(encoding)

    createReadStream(file, { highWaterMark: 1024 * 1024 /* better to use more memory but hash faster */ })
      .on("error", reject)
      .on("end", () => {
        hash.end()
        resolve(hash.read())
      })
      .pipe(hash, { end: false })
  })
}

async function main() {
  const args = process.argv;
  const folderPath = args.pop();
  const distPath = path.join(process.cwd(), folderPath);
  
  const releaseYamlPath = path.join(distPath, "latest-mac.yml");
  const releaseConfig = await readYaml(releaseYamlPath);

  for(const file of releaseConfig.files) {
    const filePath = path.join(distPath, file.url);
    const [stat, hash] = await Promise.all([
      statSync(filePath),
      getHashSum(filePath),
    ]);
    file.size = stat.size;
    file.sha512 = hash;

    if (file.path === releaseConfig.path) {
      releaseConfig.sha512 = hash;
    }
  }

  const updatedYaml = yaml.stringify(releaseConfig);
  await writeFileSync(releaseYamlPath, updatedYaml, "utf-8");
}

async function readYaml(filePath) {
  const releaseBuff = await readFileSync(filePath);
  const raw = releaseBuff.toString("utf-8");
  const config = yaml.parse(raw);
  return config;
}

main();