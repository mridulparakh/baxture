const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  id: { type: String, required: true },
  age: { type: Number, required: true },
  hobbies: { type: Array, required: true }
},
{
  timestamps:true
}
);

const User = mongoose.model('users', UserSchema);


module.exports = User;
