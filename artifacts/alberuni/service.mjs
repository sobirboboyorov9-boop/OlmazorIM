// @ts-check
import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";

export default compute({
  name: "alberuni",
  deps: {},
  build: node({ module: import.meta.url, entry: "vite.config.ts" }),
});
