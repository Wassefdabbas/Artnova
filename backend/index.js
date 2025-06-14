import express from 'express'
import cors from "cors"
import userRouter from './routes/userRoute.js'
import pinRouter from './routes/pinRoute.js'
import commentRouter from './routes/commentRoute.js'
import boardRouter from './routes/board.js'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
dotenv.config();

import connectDB from './utils/connectDB.js'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 5555

const app = express();
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(fileUpload())

app.use('/users', userRouter)
app.use('/pins', pinRouter)
app.use('/comments', commentRouter)
app.use('/boards', boardRouter)

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is Running on http://localhost:${PORT}`);
})