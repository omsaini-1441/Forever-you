import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const src = fs.readFileSync(
  path.join(root, "Client/src/assets/assets.js"),
  "utf8"
);

const start = src.indexOf("export const products = ");
const arrText = src.slice(start + "export const products = ".length);
let depth = 0;
let end = -1;
const i = arrText.indexOf("[");
for (let k = i; k < arrText.length; k++) {
  if (arrText[k] === "[") depth++;
  if (arrText[k] === "]") {
    depth--;
    if (depth === 0) {
      end = k;
      break;
    }
  }
}

const body = arrText.slice(i + 1, end);
const blocks = body.split(/\n\s*\},\s*\n\s*\{/).map((b, idx, arr) => {
  let s = b;
  if (idx === 0) s = s.replace(/^\s*\{\s*/, "");
  if (idx === arr.length - 1) s = s.replace(/\s*\}\s*$/, "");
  return `{${s}}`;
});

const products = blocks.map((block) => {
  const get = (re) => {
    const m = block.match(re);
    return m ? m[1] : null;
  };
  const sizesLine = block.match(/sizes:\s*\[([^\]]+)\]/);
  const sizesClean = sizesLine
    ? [...sizesLine[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : [];
  const imgLine = block.match(/image:\s*\[([^\]]+)\]/);
  const images = imgLine
    ? [...imgLine[1].matchAll(/p_img[\w_]+/g)].map((m) => `${m[0]}.png`)
    : [];

  return {
    name: get(/name:\s*"([^"]+)"/),
    description: get(/description:\s*"([^"]+)"/),
    price: Number(get(/price:\s*(\d+)/)),
    category: get(/category:\s*"([^"]+)"/),
    subCategory: get(/subCategory:\s*"([^"]+)"/),
    sizes: sizesClean,
    bestseller: /bestseller:\s*true/.test(block),
    date: Number(get(/date:\s*(\d+)/)),
    images,
  };
});

const outDir = path.join(root, "Server/data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "products.json"),
  JSON.stringify(products, null, 2)
);
console.log(`Wrote ${products.length} products to Server/data/products.json`);
