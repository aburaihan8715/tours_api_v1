import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './src/app.js';

const port = process.env.SERVER_PORT || 5001;

mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => console.log('DB is connected!'));

// console.log(process.env);
app.listen(port, () => {
  console.log(
    `Server is running at http://localhost:${port}`,
  );
});
