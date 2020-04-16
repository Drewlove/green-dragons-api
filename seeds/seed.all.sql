BEGIN;
\i /Users/Drew/Projects/green-dragons-api/seeds/001.seed.green_dragons_user.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/002.seed.user.sql

COMMIT;

-- SEED ALL, copy and paste: psql -f ~/Projects/boilerplate-api/seeds/seed.all.sql boilerplate;
