
const mongoose = require("mongoose");

const connectDB = async () => {
    
    try {
        console.log("Mongo URL exists:", !!process.env.MONGO_URL);
        const connection = await mongoose.connect(
            process.env.MONGO_URL
        );

        console.log(
            `MongoDB Connected Successfully: ${connection.connection.host}`
        );
        console.log("Database Name:", connection.connection.name);


        return connection;

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);

        throw error;
    }
};

module.exports = connectDB;
