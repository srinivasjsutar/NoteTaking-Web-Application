const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const notesRouter = require("./routes/notes");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// API routes
app.use("/api/notes", notesRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
