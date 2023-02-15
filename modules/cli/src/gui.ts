import yargs from 'https://cdn.deno.land/yargs/versions/yargs-v16.2.1-deno/raw/deno.ts';
import { open } from 'https://deno.land/x/open/index.ts';
import { serve } from "https://deno.land/std/http/mod.ts";

const BASE_PATH = "./build";
interface Arguments {
  _: string[];
  scripts: string;
  server: string;
}

let inputArgs: Arguments = yargs(Deno.args)
.alias('s', 'scripts').argv;

// async function serveHttp(conn: Deno.Conn) {
//   // This "upgrades" a network connection into an HTTP connection.
//   const httpConn = Deno.serveHttp(conn);
//   // Each request sent over the HTTP connection will be yielded as an async
//   // iterator from the HTTP connection.
//   for await (const requestEvent of httpConn) {
//     // The native HTTP server uses the web standard `Request` and `Response`
//     // objects.
//     const body = `Your user-agent is:\n\n${
//       requestEvent.request.headers.get("user-agent") ?? "Unknown"
//     }`;
//     // The requestEvent's `.respondWith()` method is how we send the response
//     // back to the client.
//     requestEvent.respondWith(
//       new Response(body, {
//         status: 200,
//       }),
//     );
//   }
// }



console.log(inputArgs);

if (!inputArgs._.length || inputArgs._.includes("serve")) {
  // const server = Deno.listen({ port: 8080 });
  // console.log(`GUI HTTP webserver running.  Access it at:  http://localhost:8080/`);

  // open("http://localhost:8080");
  // // Connections to the server will be yielded up as an async iterable.
  // for await (const conn of server) {
  //   // In order to not be blocking, we need to handle each connection individually
  //   // without awaiting the function
  //   serveHttp(conn);
  // }
  const spaDefault = await Deno.readFile("./build/index.html");
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
  // Respond to the request with the style.css file.

  const reqHandler = async (req: Request) => {
    const filePath = BASE_PATH + new URL(req.url).pathname;
    // let fileSize;
    // try {
    //   fileSize = (await Deno.stat(filePath)).size;
    // } catch (e) {
    //   if (e instanceof Deno.errors.NotFound) {
    //     return new Response(null, { status: 404 });
    //   }
    //   return new Response(null, { status: 500 });
    // }
    // return new Response(filePath);
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
}