const { createHash } = require("crypto");
const { createReadStream } = require("fs");
const file = "tea-0.0.2-arm64.dmg";

function hashFile(file, encoding = "base64") {
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

// hashFile(file)
//   .then((res) => {
//     console.log("res",res)
//   })

async function main() {
  const args = process.argv;
  const filePath = args.pop();
  const hash = await hashFile(filePath);
  console.log(hash);
}

main();