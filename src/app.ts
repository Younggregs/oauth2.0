import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes.
app.use("/api/oauth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
