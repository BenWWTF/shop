import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { getConfigFile } from "@medusajs/medusa/dist/loaders/config";
import path from "path";
import { registerOverriddenFeatures } from "@medusajs/medusa/dist/loaders/helpers/override";

const ENV_FILE_NAME = ".env";

export const dataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.MEDUSA_BACKEND_LOGGING === "true" && ["query", "error"],
  entities: [],
  migrations: [path.join(__dirname, "migrations/*.ts")],
};

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: process.cwd() + "/" + ENV_FILE_NAME });
}

export default registerOverriddenFeatures();
