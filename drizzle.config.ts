import { defineConfig } from 'drizzle-kit'
export default defineConfig({
    schema: "./config/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_G28IRULYrWvo@ep-white-thunder-a5jsb428-pooler.us-east-2.aws.neon.tech/ai-kids-story-builder?sslmode=require',
    },
    verbose: true,
    strict: true,
})