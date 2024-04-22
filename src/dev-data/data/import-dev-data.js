import fs from 'fs';
import 'dotenv/config';
import path from 'path';
import mongoose from 'mongoose';
import { Tour } from '../../models/tourModel.js';
import { User } from '../../models/userModel.js';
import { Review } from '../../models/reviewModel.js';

const __dirname = path.resolve();

mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => console.log('DB is connected!'))
  .catch((error) => console.error(error));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/src/dev-data/data/tours.json`, 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/src/dev-data/data/users.json`, 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/src/dev-data/data/reviews.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log(`Data successfully loaded!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log(`Data successfully deleted!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// node src/dev-data/data/import-dev-data.js --import
// node src/dev-data/data/import-dev-data.js --delete
