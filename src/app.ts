import express from "express";
import cors from "cors";
import tradesRouter from "./routes/trades";
// ... other imports ...

const app = express();

app.use(cors());
app.use(express.json());

// ... other middleware and routes ...

app.use("/api/trades", tradesRouter);

// ... rest of the file ...
