import User from "../models/userModel.js";
import Pin from "../models/pinModel.js";
import Board from "../models/boardModel.js";
import Comment from "../models/commentModel.js";
import bcrypt from "bcryptjs";
import connectDB from "./connectDB.js";
import mongoose from "mongoose"; // Import mongoose directly

// Connect to DB with proper timeout settings
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const seedDB = async () => {
    try {
        await connectWithRetry();

        console.log('🧹 Clearing old data...');
        await User.deleteMany({});
        await Pin.deleteMany({});
        await Board.deleteMany({});
        await Comment.deleteMany({});
        console.log('✅ Old data cleared');

        console.log('🌱 Seeding users...');
        const users = [];
        for (let i = 1; i <= 10; i++) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            const user = new User({
                displayName: `User ${i}`,
                userName: `user${i}`,
                email: `user${i}@example.com`,
                hashedPassword: hashedPassword,
                img: `https://picsum.photos/id/${i}/200/200`,
            });
            users.push(await user.save());
        }

        console.log('📋 Seeding boards...');
        const boards = [];
        for (const user of users) {
            for (let i = 1; i <= 10; i++) {
                const board = new Board({
                    title: `Board ${i} of ${user.userName}`,
                    user: user._id,
                });
                boards.push(await board.save());
            }
        }

        console.log('📌 Seeding pins...');
        const pins = [];
        for (const user of users) {
            const userBoards = boards.filter(
                (board) => board.user.toString() === user._id.toString()
            );
            for (let i = 1; i <= 10; i++) {
                const mediaSize = Math.random() < 0.5 ? "800/1200" : "800/600";
                const pin = new Pin({
                    media: `https://picsum.photos/id/${i + 10}/${mediaSize}`,
                    width: 800,
                    height: mediaSize === "800/1200" ? 1200 : 600,
                    title: `Pin ${i} by ${user.username}`,
                    description: `This is pin ${i} created by ${user.username}`,
                    link: `https://example.com/pin${i}`,
                    board: userBoards[i - 1]._id,
                    tags: [`tag${i}`, "sample", user.username],
                    user: user._id,
                });
                pins.push(await pin.save());
            }
        }

        // In your seedDB() function, replace the comment section with:
        console.log('💬 Seeding comments...');
        for (const user of users) {
            for (let i = 1; i <= 10; i++) {
                const randomPin = pins[Math.floor(Math.random() * pins.length)];
                const comment = new Comment({
                    media: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/200`, // Random image
                    description: `Comment ${i} by ${user.username}: This is a great pin!`,
                    pin: randomPin._id,
                    user: user._id,
                });
                await comment.save();
            }
        }

        console.log("🎉 Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();