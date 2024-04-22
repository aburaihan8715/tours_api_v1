import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // NOTE: This is shorthand
      // required: [true, 'Tour name is required'],
      // OR
      required: {
        values: true,
        message: 'Tour name is required',
      },
      unique: true,
      trim: true,
      maxLength: [40, 'Tour name must have less or equal than 40 characters'],
      minLength: [10, 'Tour name must have more or equal than 10 characters'],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'Tour duration is required'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'Tour group size is required'],
    },

    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // NOTE: important to understand
      // Here val refers input value from user
      // This function run each time the input value changes
      set: (val) => Math.round(val * 10) / 10, // 4.66666, 46.6666, 47, 4.7
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    price: {
      type: Number,
      required: [true, 'Tour price is required'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // NOTE: it only works the time of create new doc but not the time update doc
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour summary is required'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'Tour image cover is required'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // As Embedded
    // guides: Array,

    // As Ref
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// INDEXING SOME FIELDS
// tourSchema.index({ price: 1 });
// compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// VIRTUAL PROPERTIES
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// NOTE: if need "this" must use regular function,otherwise arrow function no problem
// pre
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// pre
// tourSchema.pre('save', (next) => {
//   console.log(`will save document!`);
//   next();
// });

// post
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: runs before any find method (find(),findOne() etc)
// NOTE: if need "this" must use regular function,otherwise arrow function no problem
// pre
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// post
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   // this._pipeline.unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this._pipeline);
//   // OR
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

export const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);
