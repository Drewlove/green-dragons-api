module.exports = {
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN || "dummy-api-token",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://postgres@localhost/green_dragons",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://postgres@localhost/db_boilerplate",
};
