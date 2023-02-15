import yargs from 'https://cdn.deno.land/yargs/versions/yargs-v16.2.1-deno/raw/deno.ts';
import { open } from 'https://deno.land/x/open/index.ts';
import { serve } from "https://deno.land/std/http/mod.ts";
import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;
const BASE_PATH = path.join(__dirname, "../build");
interface Arguments {
  _: string[];
  scripts: string;
  serve: string;
}

let inputArgs: Arguments = yargs(Deno.args)
.alias('s', 'scripts').argv;

if (!inputArgs._.length || inputArgs._.includes("serve")) {
  const spaDefault = await Deno.readFile(path.join(BASE_PATH, "index.html"));
  const contentType: { [key:string]: string } = {
    'html': 'text/html',
    'js': 'application/javascript',
    'json': 'application/json',
    'css': 'text/css',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
  }

  const reqHandler = async (req: Request) => {
    const filePath = BASE_PATH + new URL(req.url).pathname;
    const ext = filePath.split(".").pop() as string;
    if (contentType[ext]) {
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        headers: {
          "content-type": contentType[ext],
        },
      });
    } else {
      return new Response(spaDefault, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
  };
  serve(reqHandler, { port: 8080 });
  open('http://localhost:8080')
} else {
  console.log(`tea.xyz/gui: uploading script...`)
  console.log(`tea.xyz/gui: script has been uploaded!`);
  console.log("tea.xyz/gui: start gui `$ gui serve` then access http://localhost:8080/scripts/12312312x to edit");
}