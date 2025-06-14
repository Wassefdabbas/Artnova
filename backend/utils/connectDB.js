import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to MongoDB')
    } catch(err) {
        console.error(err);
    }
}

export default connectDB;