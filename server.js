import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './src/app.js';

const port = process.env.SERVER_PORT || 5001;
const mongoAtlasUri = process.env.MONGO_ATLAS_URI.replace(
  '<PASSWORD>',
  process.env.DB_PASS,
);

mongoose
  .connect(mongoAtlasUri)
  .then(() => console.log('DB is connected!'));

// console.log(process.env);
app.listen(port, () => {
  console.log(
    `Server is running at http://localhost:${port}`,
  );
});
