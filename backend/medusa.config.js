const dotenv = require("dotenv");

let ENV_FILE_NAME = ".env";
if (process.env.NODE_ENV) {
  ENV_FILE_NAME = `.env.${process.env.NODE_ENV}`;
}

if (process.env.NODE_ENV !== "production") {
  const envSuffix = process.env.LOG_LEVEL ? `.${process.env.LOG_LEVEL}` : "";
  require("dotenv").config({ path: process.cwd() + "/" + ENV_FILE_NAME + envSuffix });
}

const DATABASE_URL = process.env.DATABASE_URL || "postgres://medusa_user:postgres@localhost:5432/medusa_shop";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  {
    resolve: `@medusajs/admin`,
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: process.env.NODE_ENV === "development",
      outDir: "dist",
    },
  },
  {
    resolve: `medusa-payment-stripe`,
    /** @type {import('medusa-payment-stripe').PluginOptions} */
    options: {
      api_key: process.env.STRIPE_API_KEY,
    },
  },
];

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    jwtSecret: process.env.JWT_SECRET || "supersecretkey",
    cookieSecret: process.env.COOKIE_SECRET || "super_secret",
    database_database: process.env.DB_NAME || "medusa_shop",
    database_type: "postgres",
    database_url: DATABASE_URL,
    http_compression: {
      enabled: true,
      level: 6,
      memLevel: 7,
      threshold: 1024,
    },
  },
  featureFlags: {
    sales_channels: true,
    publishable_api_keys: true,
  },
  plugins,
};
