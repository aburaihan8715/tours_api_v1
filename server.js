import mongoose from 'mongoose';
import { app } from './src/app.js';
import { mongoAtlasUri, serverPort } from './src/libs/secret.js';

// UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// DB CONNECTION
mongoose.connect(mongoAtlasUri).then(() => console.log('DB is connected!'));

// console.log(process.env);
const server = app.listen(serverPort, () => {
  console.log(`Server is running at http://localhost:${serverPort}`);
});

// UNHANDLED REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
