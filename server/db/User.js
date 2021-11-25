var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    image: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
    password: {type:String, default:''},
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    isStudent: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.plugin(mongoosePaginate);
var User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
