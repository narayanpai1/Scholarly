var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var CourseSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    name: String,

    description: {
      type: String,
      default: '',
    },

    url: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjW8BEA87TL1WHCVU9YGfRcFai8gU3OGQ2OlS_yD0wTqQAQ94rGwXuBxILE3KX1ERsNlo&usqp=CAU',
    },
  },
  { timestamps: true },
);

CourseSchema.plugin(mongoosePaginate);
var Course = mongoose.model('Course', CourseSchema, 'Course');

module.exports = Course;
