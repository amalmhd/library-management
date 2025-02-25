import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "@/lib/config";

const dbUrl = config.env.dbUrl;

const sql = neon(dbUrl);
export const db = drizzle({ client: sql });
