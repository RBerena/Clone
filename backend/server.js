import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js"
import { sql } from "../config/db.js"

dotenv.config();
const app =express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS Users(
            User_ID SERIAL PRIMARY KEY,
            Username VARCHAR(255) UNIQUE NOT NULL,
            First_Name VARCHAR(255) NOT NULL,
            Last_Name VARCHAR(255) NOT NULL,
            Email VARCHAR(255) NOT NULL,
            Password VARCHAR(255) NOT NULL,
            Phone_Number VARCHAR(11) NOT NULL,
            Country_Code VARCHAR(2) NOT NULL,
            Date_Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            Created_By VARCHAR(255) NULL,
            Role VARCHAR(5) NULL
        );
        `;
        console.log("Database Initialized successfully");
    }   catch(error){
        console.log("Error initDB", error);
    }
}

initDB().then(()=>{
    app.listen(PORT, "0.0.0.0",()=>{
     console.log("Server is running on port " + PORT);
 });
})