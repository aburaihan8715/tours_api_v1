import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './src/app.js';

// UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => console.log('DB is connected!'));

// console.log(process.env);
const port = process.env.SERVER_PORT || 5001;
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// UNHANDLED REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
