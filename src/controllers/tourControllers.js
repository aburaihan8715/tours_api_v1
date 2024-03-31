import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/src/dev-data/data/tours-simple.json`,
  ),
  // fs.readFileSync(`./src/dev-data/data/tours-simple.json`)
);

// CHECK ID
const checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid ID: ${val}`,
    });
  }
  next();
};

// CHECK BODY
const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
// GET ALL TOURS
const getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    result: tours.length,
    requestedAt: req.requestTime,
    status: 'success',
    data: tours,
  });
};
// CREATE A TOUR
const createATour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/src/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) console.log(error);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};
// GET A TOUR
const getATour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((item) => item.id === id);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
// UPDATE A TOUR
const updateATour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((item) => item.id === id);
  const othersTours = tours.filter(
    (item) => item.id !== id,
  );
  const updatedTour = { ...tour, ...req.body };
  const updatedTours = [...othersTours, updatedTour];

  fs.writeFile(
    `${__dirname}/src/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (error) => {
      if (error) console.log(error);
      res.status(201).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    },
  );
};
// DELETE A TOUR
const deleteATour = (req, res) => {
  const id = req.params.id * 1;

  const updatedTours = tours.filter(
    (tour) => tour.id !== id,
  );

  fs.writeFile(
    `${__dirname}/src/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (error) => {
      if (error) console.log(error);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    },
  );
};

export {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
  checkId,
  checkBody,
};
