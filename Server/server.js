const dns = require("node:dns");

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const bcrypt = require("bcrypt");
const User = require("./models/User");

const express=require('express');
const cors=require('cors');
require("dotenv").config();
const app=express();
app.use(cors());
app.use(express.json());

const weatherRoutes=require("./routes/weatherRoutes");
const newsRoutes=require("./routes/newsRoute")
const getAirQuality=require("./routes/airQualityRoutes")
const authRoutes=require("./routes/authRoutes");

const connectDB=require("./config/db");



app.use("/api/weather", weatherRoutes);

app.use("/api/news",newsRoutes);

app.use("/api/airquality",getAirQuality)
app.use("/api/auth",authRoutes)



app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find registered user
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register."
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    res.json({
      success: true,
      message: "Login Successful"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});






//connectDB();

app.get("/",(req,res)=>{
    res.json({
        message:"Smart City is running 🚀",
    });
});

console.log("NEWS KEY:", process.env.NEWS_API_KEY);

const PORT=process.env.PORT || 5000;




// Connect MongoDB first, then start server

const startServer = async () => {
    try {
        await connectDB();

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
    }
};

startServer();

