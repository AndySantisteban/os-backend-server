// @ts-check
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const enterpriseRoute = require("./routes/enterprise");
const cors = require("cors");

dotenv.config();
// db connection
mongoose
    .connect(process.env.DB_CONNECTION)
    .then(() => console.log(" ✔ DB"))
    .catch((err) => {
        console.log(err);
    });

// routes
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/enterprise", enterpriseRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

// server init
app.listen(process.env.PORT || 5000, () => {
    console.log("🏃‍♂️ Server");
});