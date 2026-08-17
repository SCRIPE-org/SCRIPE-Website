/**
 * Minimal static file server for local preview.
 *
 *   node tools/serve.mjs [port]     # defaults to 5173
 *
 * Node 18+, no dependencies. Any static server works just as well — this one
 * exists so the site can be previewed without installing anything.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const PORT = Number(process.argv[2]) || 5173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split("?")[0]);
  if (path.endsWith("/")) path += "index.html";

  // keep the request inside the site root
  const safe = normalize(path).replace(/^([.]{2}[/\\])+/, "");
  const file = join(ROOT, safe);

  try {
    const info = await stat(file);
    if (info.isDirectory()) throw new Error("directory");
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] || "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(body);
  } catch {
    const body = await readFile(join(ROOT, "404.html")).catch(() => "Not found");
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
  }
}).listen(PORT, () => {
  console.log(`SCRIPE static site → http://localhost:${PORT}`);
});
