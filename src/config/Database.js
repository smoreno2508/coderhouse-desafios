import mongoose from "mongoose";

const dbConnection = async () => {
    const mongoURL = process.env.MONGODB_ATLAS;

    if (!mongoURL) {
        throw new Error('MongoDB connection URL is not defined in environment variables.');
    }

    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Database online.");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw new Error('Error initializing the database');
    }
};

export default dbConnection;
