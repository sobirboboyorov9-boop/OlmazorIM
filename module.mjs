// @ts-check
import { module } from "@prisma/composer";
import alberuniService from "./artifacts/alberuni/service.mjs";
import apiServerService from "./artifacts/api-server/service.mjs";

export default module("alberuni", ({ provision }) => {
  provision(alberuniService);
  provision(apiServerService, { id: "apiserver" });
});
