import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes imports
import userRoutes from './routes/user.route.js';
import blogRoutes from './routes/blog.route.js';

// routes declaration
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/blogs", blogRoutes)

export { app };