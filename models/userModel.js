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
      validator: function(el){
        return el = this.password; //123456 === 123456 
      },
      message: 'Password are not the same!'
    }
  }
});

userSchema.pre('save', async function(next){
  //Run tihs function if passowrd was actulay modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model('User', userSchema);

module.exports = User;
