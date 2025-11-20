import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const {PGHOST,PGDATABASE,PGUSER,PGPASSWORD} = process.env;

// Creates SQL connection using our env variables
export const sql = neon(
    `postgresql://neondb_owner:npg_RK0n7edIlxCp@ep-lingering-dream-adtzli3c-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
)

// This SQL function that is exported is used as a tagged template literal, which allows use to write 
// SQL queries safely