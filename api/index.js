import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js'

dotenv.config();

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}!!`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err,req , res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message|| 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
