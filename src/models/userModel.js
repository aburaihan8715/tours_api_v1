import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your name'],
    unique: true,
    lowercase: true,
  },

  photo: {
    type: String,
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password are not the same!',
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// DOCUMENT MIDDLEWARE
// manipulate password

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 8);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

// manipulate passwordChangedAt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// INSTANCE METHODS
// compare password
userSchema.methods.isPasswordCorrect = async function (
  inputPassword,
  storedPassword,
) {
  return await bcrypt.compare(inputPassword, storedPassword);
};

// if password changed
userSchema.methods.isPasswordChangedAfter = function (jwtIssueTime) {
  if (this.passwordChangedAt) {
    const passwordChangeTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtIssueTime < passwordChangeTime;
  }
  return false;
};

// generate random token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetToken = hashedToken;
  // console.log({ resetToken }, { hashedToken: this.passwordResetToken });
  this.passwordResetExpires = Date.now() + 1000 * 60 * 10;
  return resetToken;
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
