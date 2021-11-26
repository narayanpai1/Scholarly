var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var MeetingSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },

    name: String,

    attendeePassword: String,

    moderatorPassword: String,

    record:{
      type: Boolean, default: true
    },
  },
  { timestamps: true },
);

MeetingSchema.plugin(mongoosePaginate);
var Meeting = mongoose.model('Meeting', MeetingSchema, 'Meeting');

module.exports = Meeting;
