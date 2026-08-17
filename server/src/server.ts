import express from "express";
import cors from "cors";
import pool from "./config/database";
import authRoutes from "./routes/authRoutes";

const app = express();

const PORT = 5000;

// middleware setup
app.use(cors()); // enable cross origin resource sharing
//it allowa backend to receive requests from a different origin(ex: frontend)

app.use(express.json()); // allowa express to understand JSON data sent in HTTP requests
// without express.json() , req.body maybe undefined for JSON requests

//routes
app.use("/api/auth", authRoutes);

//health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Library management api is running!"
    });
});

//database test
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        
        res.json({
            success: true,
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.log("Database connection error");
        
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        })
    }
})

//start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})