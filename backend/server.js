import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();
dotenv.config();

//Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/posts", postRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})