import express from "express";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// App uses

// App routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
