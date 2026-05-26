require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
const offerRoutes = require("./routes/offerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const queryRoutes = require("./routes/queryRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Foreign Suppliers API is running" });
});

app.use("/api/companies", companyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/queries", queryRoutes);

app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });
