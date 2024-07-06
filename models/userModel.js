const {
  model,
  Schema,
  Types: { ObjectId },
  default: mongoose
} = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    // To not show up on any output
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Plase confirm your password'],
    validate: {
      // This work only on CREATE and SAVE
      validator: function(el) {
        return (el = this.password); //123456 === 123456
      },
      message: 'Password are not the same!'
    }
  },
  passwordChangedAt: {
    type: Date
  }
});

userSchema.pre('save', async function(next) {
  //Run tihs function if passowrd was actulay modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm field
  this.passwordConfirm = undefined;

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestampt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //Will be return true
    return JWTTimestamp < changedTimestampt; //100 < 200
  }
  //False means NOT CHANGES
  return false;
};

const User = model('User', userSchema);

module.exports = User;
